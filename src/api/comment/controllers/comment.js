"use strict";

const { default: axios } = require("axios");

/**
 * comment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::comment.comment", ({ strapi }) => ({
  find: async (ctx) => {
    try {
      const { videoId } = ctx.query;
      const res = await strapi.documents("api::comment.comment").findMany({
        filters: {
          video: {
            documentId: videoId,
          },
        },
        fields: ["createdAt", "message", "response"],
        populate: {
          author: {
            fields: ["name", "username", "email"],
          },
          respondedBy: {
            fields: ["firstname"],
          },
        },
        sort: {
          createdAt: "desc",
        },
      });
      ctx.body = res;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },

  create: async (ctx) => {
    try {
      const { comment, includeTimestamp, timeStamp, videoId } =
        ctx.request.body;
      const { minutes, seconds } = timeStamp;
      const { user } = ctx.state;

      if (!user.documentId) {
        ctx.unauthorized();
      }

      if (!videoId || !comment) {
        ctx.badRequest();
      }

      const res = await strapi.documents("api::comment.comment").create({
        data: {
          message: comment,
          author: {
            connect: [user.documentId],
          },
          video: {
            connect: [videoId],
          },
          minutes,
          seconds,
        },
        fields: ["createdAt", "message", "response"],
        populate: {
          author: {
            fields: ["name", "username", "email"],
          },
          respondedBy: {
            fields: ["firstname"],
          },
          video: {
            fields: ["source", "videoUrl"],
          },
        },
      });

      if (minutes + seconds != 0 && res.video?.source == "bunny") {
        const url = res?.video?.videoUrl;
        const libraryId = url?.split("/embed/")[1]?.split("/")[0];
        const videoId = url?.split("/embed/")[1]?.split("/")[1];

        try {
          await axios.post(
            `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`,
            {
              headers: {
                "Content-Type": "application/json",
                AccessKey: process.env.BUNNY_STREAM_KEY,
              },
              body: {
                moments: [
                  {
                    label: comment,
                    timestamp: minutes * 60 + seconds,
                  },
                ],
              },
            },
          );
        } catch (error) {
          console.log("Error while posting comment to Bunny");
          console.log(error);
        }
      }

      ctx.body = res;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
}));

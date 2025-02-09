"use strict";

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
      const { comment, includeTimestamp, timeStamp, videoId } = ctx.request.body;
      const {minutes, seconds} = timeStamp
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
        },
      });
      ctx.body = res;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
}));

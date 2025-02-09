"use strict";

const { filter } = require("../../../../config/middlewares");

/**
 * video controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::video.video", ({ strapi }) => ({
  findOne: async (ctx) => {
    try {
      const { id } = ctx.params;
      const res = await strapi.documents("api::video.video").findOne({
        documentId: id,
        fields: [
          "name",
          "description",
          "duration",
          "source",
          "videoUrl",
          "createdAt",
        ],
        populate: {
          video: {
            fields: ["url"],
          },
          thumbnail: {
            fields: ["url"],
          },
          project: {
            fields: ['name']
          }
        },
      });

      ctx.body = res;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
}));

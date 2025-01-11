"use strict";

/**
 * project controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::project.project", ({ strapi }) => ({
  create: async (ctx) => {
    try {
      const { name, description } = ctx.request.body;

      const project = await strapi.documents("api::project.project").create({
        data: {
          name: name,
          description: description,
          author: {
            connect: [ctx.state.user.id],
          },
        },
      });

      return (ctx.body = project);
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
}));

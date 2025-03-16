"use strict";

/**
 * project controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::project.project", ({ strapi }) => ({
  find: async (ctx) => {
    try {
      const data = await strapi.documents("api::project.project").findMany({
        filters: {
          $or: [
            {
              author: {
                documentId: ctx.state.user.documentId,
              },
            },
            {
              members: {
                documentId: ctx.state.user.documentId,
              },
            },
          ],
        },
        fields: ["name", "description", "createdAt"],
        populate: {
          videos: {
            fields: ["name"],
          },
          members:{
            fields: ['name', 'username', 'email', 'createdAt']
          },
          author:{
            fields: ['email', 'name', 'username', 'createdAt']
          }
        },
        sort: {
          createdAt: "desc",
        },
      });
      const res = data.map((item) => {
        return {
          ...item,
          videosCount: item.videos ? item.videos.length : 0,
        };
      });
      ctx.body = res;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },

  findOne: async (ctx) => {
    try {
      const res = await strapi.documents("api::project.project").findOne({
        documentId: ctx.params.id,
        fields: ["name", "description", "createdAt"],
        populate: {
          videos: {
            fields: ["name", "duration", "source", "videoUrl", "createdAt"],
            populate: {
              video: {
                fields: ["url"],
              },
              thumbnail: {
                fields: ["url"],
              },
            },
          },
          subscription: {
            fields: ["revisionsLeft"],
          },
          members: {
            fields: ["name", "username", "email"],
            populate: {
              avatar: {
                fields: ["url"],
              },
            },
          },
        },
      });
      console.log(res);
      console.log(typeof res);
      if (res == null) {
        ctx.notFound();
      } else {
        ctx.body = res;
      }
    } catch (error) {
      ctx.internalServerError(error);
    }
  },

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

  update: async (ctx) => {
    try {
      const { description } = ctx.request.body;
      const project = await strapi.documents("api::project.project").update({
        documentId: ctx.params.id,
        data: {
          description: description,
        },
      });
      ctx.body = project;
    } catch (error) {
      ctx.internalServerError(error);
    }
  },
}));

/**
 * asset controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::asset.asset",
  ({ strapi }) => ({
    find: async (ctx) => {
      try {
        const { projectId } = ctx.query;

        if (!projectId) {
          return ctx.notFound();
        }

        const res = await strapi.documents("api::asset.asset").findMany({
          filters: {
            project: {
              documentId: projectId,
            },
          },
          fields: ["createdAt", "name", "approvalStatus"],
          populate: {
            project: {
              fields: ["name"],
            },
            assets: {
              fields: ["name", "url", "size"],
            },
            uploadedBy: {
              fields: ["name", "username", "email"],
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
        const { projectId, name } = ctx.request.body;

        if (!projectId) {
          return ctx.badRequest("Project ID (projectId) is required");
        }


        const res = await strapi.documents("api::asset.asset").create({
          data: {
            name: name,
            project: {
              // @ts-ignore
              connect: [projectId],
            },
            uploadedBy: {
              // @ts-ignore
              connect: [ctx.state.user.documentId],
            },
          },
          fields: ["createdAt", "name", "approvalStatus"],
          populate: {
            project: {
              fields: ["name"],
            },
            assets: {
              fields: ["name", "url", "size"],
            },
            uploadedBy: {
              fields: ["name", "username", "email"],
            },
          },
        });
        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

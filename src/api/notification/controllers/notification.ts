/**
 * notification controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::notification.notification",
  ({ strapi }) => ({
    find: async (ctx) => {
      try {
        const res = await strapi
          .documents("api::notification.notification")
          .findMany({
            filters: {
              $or: [
                {
                  targetUser: {
                    documentId: ctx.state.user.documentId,
                  },
                },
                {
                  isGlobalNotification: true,
                },
              ],
            },
            fields: [
              "title",
              "category",
              "description",
              "ctaLabel",
              "ctaUrl",
              "createdAt",
            ],
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

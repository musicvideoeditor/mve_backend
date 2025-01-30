/**
 * appointment-slot controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::appointment-slot.appointment-slot",
  ({ strapi }) => ({
    find: async (ctx) => {
      try {
        const res = await strapi
          .documents("api::appointment-slot.appointment-slot")
          .findMany({
            filters: {
              isActive: true,
            },
            fields: ["from", "to"],
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

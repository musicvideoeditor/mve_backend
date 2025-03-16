"use strict";

/**
 * transaction controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    find: async (ctx) => {
      try {
        const { user } = ctx.state;
        const res = await strapi
          .documents("api::transaction.transaction")
          .findMany({
            filters: {
              paidBy: {
                documentId: user?.documentId,
              },
            },
            fields: ["amount", "paymentStatus", "refId", "method", "updatedAt"],
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

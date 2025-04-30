/**
 * appointment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::appointment.appointment",
  ({ strapi }) => ({
    create: async (ctx) => {
      try {
        const { date, slots, purpose } = ctx.request.body;
        const res = await strapi
          .documents("api::appointment.appointment")
          .create({
            data: {
              date: date,
              purpose: purpose,
              // slot: {
              //   // @ts-ignore
              //   connect: slots,
              // },
              user: {
                // @ts-ignore
                connect: [ctx.state.user.documentId],
              },
            },
            fields:['purpose','date','meetingStatus','meetingUrl','postponedDate'],
            populate: {
              slot: {
                fields: ["from", "to"],
              },
            }
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
    find: async (ctx) => {
      try {
        const res = await strapi
          .documents("api::appointment.appointment")
          .findMany({
            filters: {
              user: {
                documentId: ctx.state.user.documentId,
              },
            },
            fields: ["purpose", "date", "meetingStatus", "meetingUrl", "postponedDate"],
            populate: {
              slot: {
                fields: ["from", "to"],
              },
            },
            sort: {
                createdAt: "desc"
            }
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

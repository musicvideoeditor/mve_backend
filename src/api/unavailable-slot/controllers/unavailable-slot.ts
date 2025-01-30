/**
 * unavailable-slot controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::unavailable-slot.unavailable-slot",
  ({ strapi }) => ({
    getUnavailableDates: async (ctx) => {
      try {
        const res = await strapi
          .documents("api::unavailable-slot.unavailable-slot")
          .findMany({
            filters: {
              isHoliday: true,
            },
            fields: ["date"],
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
    getUnavailableSlots: async (ctx) => {
      try {
        const { date } = ctx.query;
        const unavailableSlots = await strapi
          .documents("api::unavailable-slot.unavailable-slot")
          .findMany({
            filters: {
              date: date,
            },
            populate: {
              unavailableSlots: {
                fields: ["from", "to"],
              },
            },
          });

          const bookedSlots = await strapi
          .documents("api::appointment.appointment")
          .findMany({
            filters: {
              date: date,
            },
            populate: {
              slots:{
                fields: ["from", "to"]
              }
            },
          });

          let res = []

          for (let i = 0; i < unavailableSlots.length; i++) {
            for (let j = 0; j < unavailableSlots[i].unavailableSlots.length; j++) {
              res.push(unavailableSlots[i].unavailableSlots[j])
            }
          }

          for (let i = 0; i < bookedSlots.length; i++) {
            for (let j = 0; j < bookedSlots[i].slots.length; j++) {
              res.push(bookedSlots[i].slots[j])
            }
          }

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

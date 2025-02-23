/**
 * home-config controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::home-config.home-config",
  ({ strapi }) => ({
    find: async (ctx) => {
      try {
        const homeConfig = await strapi
          .documents("api::home-config.home-config")
          .findFirst({
            fields: ["showOfferSection", "phoneNumber"],
            populate: {
              clientLogos: {
                fields: ["url"],
              },
            },
          });

        const portfolio = await strapi
          .documents("api::portfolio.portfolio")
          .findMany({
            fields: ["clientName", "clientSubtitle", "url"],
            populate: {
              logo: {
                fields: ["url"],
              },
            },
          });

        const faqs = await strapi.documents("api::faq.faq").findMany({
          fields: ["question", "answer"],
        });

        const plans = await strapi.documents("api::plan.plan").findMany({
          fields: ["name", "description", "price", "cancelledPrice", "flag", "color"],
          populate: {
            planBenefits: {
              fields: ["benefit"],
            },
          },
          sort: {
            position: "asc",
          },
        });

        const res = {
          config: homeConfig,
          portfolio: portfolio,
          faqs: faqs,
          plans: plans,
        };

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },
  }),
);

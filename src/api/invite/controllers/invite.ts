/**
 * invite controller
 */

import { factories } from "@strapi/strapi";
import project from "../../project/controllers/project";

export default factories.createCoreController(
  "api::invite.invite",
  ({ strapi }) => ({
    create: async (ctx) => {
      try {
        const { email, projectId } = ctx.request.body;
        let userEmail = email;
        let userName;

        const user = await strapi
          .documents("plugin::users-permissions.user")
          .findFirst({
            filters: {
              email: email,
            },
          });

        const project = await strapi
          .documents("api::project.project")
          .findFirst({
            filters: {
              documentId: projectId,
              author: {
                documentId: ctx.state.user.documentId,
              },
            },
          });

        if (!project) {
          return ctx.notFound("Project not found");
        }

        if (user?.documentId) {
          userEmail = user?.email;
          userName = user?.username;
        }

        const res = await strapi.documents("api::invite.invite").create({
          data: {
            userEmail: userEmail,
            invitedBy: {
              // @ts-ignore
              connect: [ctx.state.user.documentId],
            },
            project: {
              // @ts-ignore
              connect: [projectId],
            },
          },
        });

        await strapi
          .service("api::backend-services.backend-services")
          .sendNotification({
            channel: ["email", "dashboard"],
            sender: {
              email: ctx.state.user.email,
              name: ctx.state.user.name,
              userDocumentId: ctx.state.user.documentId,
            },
            receiver: {
              email: userEmail,
              ...(user && { name: userName }),
              ...(user && { userDocumentId: user?.documentId }),
            },
            subject: "You have been invited to join a project",
            message: `
            ${ctx.state.user.name ?? ctx.state.user.username} has invited to join <b>${project?.name}</b>. 
            Click the link below to accept the invitation.
            <br/>
            <a href="${process.env.CLIENT_URL}/dashboard/invites/${res?.documentId}">Accept Invitation</a>
            `,
            additionalParams: {
              ctaUrl: `${process.env.CLIENT_URL}/dashboard/invites/${res?.documentId}`,
              ctaLabel: "Accept Invitation",
              category: "invite",
            },
          });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },

    find: async (ctx) => {
      try {
        const { projectId } = ctx.query;

        const res = await strapi.documents("api::invite.invite").findMany({
          filters: {
            ...(projectId
              ? { project: { documentId: projectId } }
              : { userEmail: ctx.state.user.email }),
          },
          fields: ["createdAt", "userEmail", "accepted"],
          populate: {
            project: {
              fields: ["name", "description"],
            },
            invitedBy: {
              fields: ["email", "name", "username"],
              populate: {
                avatar: {
                  fields: ["url"],
                },
              }
            },
          },
        });

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },

    findOne: async (ctx) => {
      try {
        const { id } = ctx.params;
        const res = await strapi.documents("api::invite.invite").findFirst({
          filters: {
            documentId: id,
            // userEmail: ctx.state.user.email,
          },
          fields: ["createdAt", "userEmail", "accepted"],
          populate: {
            project: {
              fields: ["name", "description"],
            },
            invitedBy: {
              fields: ["email", "name", "username"],
              populate: {
                avatar: {
                  fields: ["url"],
                },
              },
            },
          },
        });

        if (!res) {
          return ctx.notFound();
        }

        ctx.body = res;
      } catch (error) {
        ctx.internalServerError(error);
      }
    },

    update: async (ctx) => {
      try {
        const { id } = ctx.params;

        const invite = await strapi.documents("api::invite.invite").findFirst({
          filters: { documentId: id },
          fields: ["createdAt", "userEmail", "accepted"],
          populate: {
            project: {
              fields: ["name"],
            },
          },
        });

        if (!invite) {
          return ctx.notFound();
        }

        // Add user to project
        await strapi.documents("api::project.project").update({
          documentId: invite?.project?.documentId,
          data: {
            members: {
              connect: [ctx.state.user.documentId],
            },
          },
        });

        const res = await strapi.documents("api::invite.invite").update({
          documentId: id,
          data: {
            accepted: true,
          },
          fields: ["createdAt", "accepted", "userEmail"],
          populate: {
            project: {
              fields: ["name", "description"],
            },
            invitedBy: {
              fields: ["email", "name", "username"],
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

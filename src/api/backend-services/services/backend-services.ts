/**
 * backend-services service
 */

export interface NotificationProps {
  sender: {
    email?: string;
    name?: string;
    userDocumentId?: string;
  };
  receiver: {
    email?: string | string[];
    phone?: string | string[];
    subscriberId?: string | string[];
    userDocumentId?: string | string[];
  };
  subject: string;
  message: string;
  additionalParams?: Record<string, string>;
}

interface Props extends NotificationProps {
  channel: Array<"email" | "dashboard">;
}

export default () => ({
  sendNotification: async (props: Props) => {
    try {
      if (props.channel.includes("email")) {
        await strapi
          .service("api::backend-services.backend-services")
          .sendEmailNotification(props);
      }

      if (props.channel.includes("dashboard")) {
        console.log("SENDING DASHBOARD NOTIFICATION");
        await strapi
          .service("api::backend-services.backend-services")
          .sendDashboardNotification(props);
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },

  sendEmailNotification: async (props: Partial<NotificationProps>) => {
    try {
      await strapi.service("plugin::email.email").send({
        to: props?.receiver?.email,
        from: "noreply@musicvideoeditor.com",
        subject: props?.subject,
        html: `${props?.message}`,
      });
      return true;
    } catch (error) {
      console.error(error);
    }
  },

  sendDashboardNotification: async (props: Partial<NotificationProps>) => {
    try {
      console.log(props);
      if (!props.receiver.userDocumentId) return { message: "ok" };

      await strapi.documents("api::notification.notification").create({
        data: {
          title: props?.subject,
          description: props?.message?.trim(),
          ctaUrl: props?.additionalParams?.ctaUrl ?? "#",
          ctaLabel: props?.additionalParams?.ctaLabel ?? "View",
          isGlobalNotification: Boolean(
            props?.additionalParams?.isGlobalNotification,
          ),
          //   @ts-ignore
          category: props?.additionalParams?.category ?? "system",
          ...(props?.receiver?.userDocumentId && {
            targetUser: {
              // @ts-ignore
              connect: props?.receiver?.userDocumentId,
            },
          }),
        },
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
});

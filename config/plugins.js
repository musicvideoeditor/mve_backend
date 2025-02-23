module.exports = ({env}) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["name"],
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp-relay.brevo.com"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: "noreply@musicvideoeditor.com",
        defaultReplyTo: "contact@musicvideoeditor.com",
      },
    },
  },
});

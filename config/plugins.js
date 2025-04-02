module.exports = ({ env }) => ({
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
  upload: {
    config: {
      provider: "@nexide/strapi-provider-bunny",
      providerOptions: {
        api_key: env("BUNNY_API_KEY"),
        storage_zone: env("BUNNY_STORAGE_ZONE"),
        pull_zone: env("BUNNY_PULL_ZONE"),
        hostname: env("BUNNY_HOSTNAME"),
        // upload_path: env("BUNNY_UPLOAD_PATH"),
      },
    },
  },
});

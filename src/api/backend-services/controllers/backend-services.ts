/**
 * A set of functions called "actions" for `backend-services`
 */
const bcrypt = require("bcrypt");
const saltRounds = 10;

export default {
  sendOTP: async (ctx, next) => {
    try {
      const { name, email, password } = ctx.request.body;
      let user;

      if (!name || !email || !password)
        return ctx.internalServerError(
          "Name, email and passwords are required",
        );

      user = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            email: email,
          },
          fields: ["confirmed"],
        });

      if (user?.confirmed)
        return ctx.internalServerError("User already exists!");

      if (!user) {
        user = await strapi.documents("plugin::users-permissions.user").create({
          data: {
            username: email?.split("@")[0] + Math.floor(Math.random() * 1000),
            email: email,
            password: password,
            name: name,
            confirmed: false,
          },
        });
      }

      // random otp
      let digits = "0123456789";
      let OTP = "";
      let len = digits.length;
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * len)];
      }

      bcrypt.hash(OTP, saltRounds, async function (err, hash) {
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            otpHash: hash,
          },
        });
      });

      console.log(OTP);

      // await strapi
      //   .service("api::backend-services.backend-services")
      //   .sendNotification({
      //     channel: ["email"],
      //     receiver: {
      //       email: email,
      //       ...(name && { name: name }),
      //     },
      //     subject: "Music Video Editor OTP",
      //     message: `
      //       Hello ${name}, <b>${OTP}</b> is your OTP to create your account on musicvideoeditor.com
      //       `,
      //   });

      return { message: "OTP sent successfully!" };
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },

  verifyOTP: async (ctx, next) => {
    try {
      const { email, otp } = ctx.request.body;

      if(!email || !otp){
        return ctx.badRequest("Email and OTP are required!")
      }

      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            email: email,
          },
        });

      if (!user) return ctx.notFound("User not found!");

      if (user.confirmed)
        return {
          message:
            "Account already verified. Please login with your credentials.",
        };

      const result = await bcrypt.compare(otp, user?.otpHash);
      if (!result) {
        console.log("Trying to throw error");
        return ctx.badRequest("Invalid OTP!");
      } else {
        // Generate JWT token
        // const jwt = await strapi.plugins[
        //   "users-permissions"
        // ].services.jwt.issue({
        //   documentId: user.documentId,
        // });

        // Confirm user
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            confirmed: true,
          },
        });

        return (ctx.body = {
          // jwt: jwt,
          user: {
            ...user,
            otpHash: null,
          },
        });
      }
      return true;
    } catch (error) {
      return ctx.internalServerError(error);
    }
  },
};

"use strict";

const { filter } = require("../../../../config/middlewares");

/**
 * video controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::video.video");

'use strict';

const Controller = require('egg').Controller;

class AboutController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        ctx.body = "about";
    }
}

module.exports = AboutController;
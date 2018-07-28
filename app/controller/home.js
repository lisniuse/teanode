'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        let data = {};
        await ctx.render('/pages/index', data);
    }
}

module.exports = HomeController;
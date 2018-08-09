'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        let data = {
            user: ctx.user || {}
        };
        await ctx.render('/pages/index', data);
    }
}

module.exports = CategoryController;
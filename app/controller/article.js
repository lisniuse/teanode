'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        ctx.body = "about";
    }

    async publish() {
        const { ctx, service, config } = this;
        let data = {
            user: ctx.user || {}
        };
        await ctx.render('/pages/article-publish', data);
    }
}

module.exports = ArticleController;
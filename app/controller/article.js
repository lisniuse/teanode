'use strict';

const Controller = require('egg').Controller;

class ArticleController extends Controller {
    async index() {
        const { ctx, service, config } = this;
        ctx.body = "about";
    }

    async pagePublish() {
        const { ctx, service, config } = this;
        let data = {
            user: ctx.user || {}
        };
        await ctx.render('/pages/article-publish', data);
    }

    async apiPublish() {
        
    }
}

module.exports = ArticleController;
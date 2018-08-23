'use strict';

const Controller = require('egg').Controller;
const validator = require('validator');

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
        const { ctx, service, config } = this;
        if ( !ctx.user._id ) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }
        const parameters = {};
        Object.keys(ctx.request.body).forEach(function (key) {
            parameters[key] = validator.trim(ctx.request.body[key] || '');
        });
        let msg;
        // 验证信息的正确性
        if (Object.keys(parameters).some(key => {
            return parameters[key] === '';
        })) {
            msg = '信息不完整。';
        } else if ( !validator.isLength(parameters.title, {min: 2, max: 50})) {
            msg = '标题必须必须8到16位，且不能出现空格。';
        }
        // END 验证信息的正确性
        if (msg) {
            ctx.status = 200;
            ctx.body = {
                code: 102,
                msg: msg
            }
            return;
        }
 
        let _article = parameters;
        //如果存在就创建文章
        let articleInfo = ctx.helper.filterFields(
        [
            'categoryId',
            'title',
            'mdContent'
        ], _article);

        articleInfo.userId = ctx.user._id;
        const articleRes = await ctx.service.article.create(articleInfo);

        //如果文章添加成功
        if (articleRes._id ) {
            // 设置响应体和状态码
            ctx.body = {
                code: 0,
                msg: '文章创建成功',
                data: articleRes
            };
        } else {
            return ctx.helper.throwError(ctx, "文章创建失败")
        }
        ctx.status = 200;
    }
}

module.exports = ArticleController;
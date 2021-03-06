'use strict';

const Controller = require('egg').Controller;
const validator = require('validator');

class InstallController extends Controller {
    async index() {
        this.ctx.body = '404';
    }

    async pageInstall() {
        const { ctx, service, config } = this;
        if ( ctx.locals.webConfig.site.installed ) {
            this.ctx.body = '404';
            return;
        }
        await ctx.render('install/pages/install', {});
    }

    async apiInstall() {
        const { ctx, service, config } = this;
        if ( ctx.locals.webConfig.site.installed ) {
            this.status = 200;
            this.ctx.body = {
                code: 4,
                msg: "论坛已经安装过了。"
            }
            return;
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
        } else if ( !validator.isEmail(parameters.adminUsername) ) {
            msg = '邮箱不合法。';
        } else if ( !validator.isLength(parameters.adminPassword, {min: 8, max: 16})) {
            msg = '密码必须8到16位，且不能出现空格。';
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

        let administratorAccountResult = await service.user.create({
            email: parameters.adminUsername,
            password: parameters.adminPassword,
            power: ["super"],
        });

        //把站点配置信息写入数据库
        let siteConfigResult = await service.config.create({
            name: "site",
            content: {
                name: parameters.siteTitle, //站点名称
                description: parameters.siteDesc, //站点描述
                keywords: "teadocs, nodejs论坛系统, nodejs开源论坛系统", //站点关键字
                logo: "", //站点Logo
                icon: "", //站点图标
                domain: parameters.siteDomain, //站点域名
                sessionSecret: parameters.sessionSecret, //用户加密因子

                allowSignUp: false, //是否允许直接注册，跳过邮箱验证
                isCloseSite: false, //是否关闭站点
                installed: true, //是否安装过系统
            }
        });

        //把邮件信息写入数据库
        let emailConfigResult = await service.config.create({
            name: "email",
            content: {
                host: parameters.emailHost,
                protocol: parameters.emailProtocol,
                authUser: parameters.emailUsername,
                authPass: parameters.emailPassword,
                ignoreTLS: true
            }
        });

        //把导航数据写入数据库
        let navConfigResult = await service.config.create({
            name: "nav",
            content: {
                navList: [{
                    name: "论坛首页",
                    target: "_self", //打开方式
                    url: "/index.html"
                }, {
                    name: "关于",
                    target: "_self", //打开方式
                    url: "/about.html"
                }]
            }
        });

        //把板块信息写入数据库
        let categoryConfigResult = await service.category.create([{
            name: "提问",
            alias: "question",
            order: 1,
        }, {
            name: "分享",
            alias: "share",
            order: 2,
        }, {
            name: "讨论",
            alias: "discuss",
            order: 3,
        }, {
            name: "建议",
            alias: "suggest",
            order: 4,
        }, {
            name: "公告",
            alias: "notice",
            order: 5,
        }]);

        if ( administratorAccountResult && 
            emailConfigResult && 
            siteConfigResult &&
            navConfigResult &&
            categoryConfigResult.length
        ) {
            ctx.status = 200;
            ctx.body = {
                code: 0,
                msg: "论坛安装成功。"
            }
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 3,
                msg: "论坛安装失败。"
            }
        }
    }
}

module.exports = InstallController;
'use strict';

const uuid = require('uuid');

module.exports = app => {
    const localHandler = async (ctx, {
        username,
        password
    }) => {
        const email = username;
        const user = await ctx.service.user.getUserByMail(email);

        // 用户不存在
        if (!user) {
            return null;
        }

        const passhash = user.password;
        // TODO: change to async compare
        const equal = ctx.helper.bcompare(password, passhash);
        // 密码不匹配
        if (!equal) {
            return null;
        }

        // 用户未激活
        if (!user.active) {
            return null;
        }

        // 验证通过
        return user;
    };

    app.passport.verify(async (ctx, user) => {
        ctx.logger.debug('passport.verify', user);

        const handler = localHandler;
        const existUser = await handler(ctx, user);

        if (existUser) {
            //获取站点配置信息
            const siteConfig = await ctx.service.config.findByConfigName("site");
            // id存入Cookie, 用于验证过期.
            const auth_token = existUser._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
            const opts = {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                signed: true,
                httpOnly: true,
            };
            ctx.cookies.set(siteConfig.content.name, auth_token, opts); // cookie 有效期30天
        }

        return existUser;
    });

    app.passport.deserializeUser(async (ctx, user) => {
        if (user) {
            const siteConfig = await ctx.service.config.findByConfigName("site");
            const auth_token = ctx.cookies.get(siteConfig.content.name, {
                signed: true
            });

            if (!auth_token) {
                return user;
            }

            const auth = auth_token.split('$$$$');
            const user_id = auth[0];
            user = await ctx.service.user.getUserById(user_id);

            if (!user) {
                return user;
            }
        }
        return user;
    });
};
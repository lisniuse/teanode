'use strict';

module.exports = () => {
    //获取网站配置信息
    return async function (ctx, next) {
        const siteConfig = await ctx.service.config.findByConfigName("site");
        const emailConfig = await ctx.service.config.findByConfigName("email");
        ctx.locals.webConfig = {
            site: siteConfig ? siteConfig.content : {} ,
            email: emailConfig ? emailConfig.content : {}
        }
        ctx.locals.csrf = ctx.csrf;
        await next();
    };
};
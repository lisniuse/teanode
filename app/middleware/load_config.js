'use strict';

module.exports = () => {
    //获取网站配置信息
    return async function (ctx, next) {
        const siteConfig = await ctx.service.config.findByConfigName("site");
        const emailConfig = await ctx.service.config.findByConfigName("email");
        const navConfig = await ctx.service.config.findByConfigName("nav");
        const categoryConfig = await ctx.service.category.find({});
        ctx.locals.webConfig = {
            site: siteConfig ? siteConfig.content : {} ,
            email: emailConfig ? emailConfig.content : {},
            navConfig: navConfig ? navConfig.content : {},
            categoryConfig: categoryConfig,
            currentUrl: ctx.request.url
        }
        ctx.locals.csrf = ctx.csrf;
        await next();
    };
};
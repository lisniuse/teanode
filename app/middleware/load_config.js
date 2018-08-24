'use strict';
const url = require('url');

module.exports = () => {
    //获取网站配置信息
    return async function (ctx, next) {
        const siteConfig = await ctx.service.config.findByConfigName("site");
        const emailConfig = await ctx.service.config.findByConfigName("email");
        const navConfig = await ctx.service.config.findByConfigName("nav");
        const categoryConfig = await ctx.service.category.find({});
        let currentUrl = ctx.origin + ctx.request.url;
        let currentUrlObj = url.parse(currentUrl, true);
        console.log(currentUrlObj);
        ctx.locals.webConfig = {
            site: siteConfig ? siteConfig.content : {} ,
            email: emailConfig ? emailConfig.content : {},
            navConfig: navConfig ? navConfig.content : {},
            categoryConfig: categoryConfig,
            currentUrl: currentUrl,
            currentQuery: ctx.query
        }
        ctx.locals.urlPath = function(options) {
            if ( !options ) return false;
            let isMatches = true;
            var checkMatch = function(obj) {
                let isMatches = true;
                for( let key in obj ) {
                    if ( obj[key] ) {
                        if ( typeof obj[key] === "object" ) {
                            if ( JSON.stringify(currentUrlObj[key]) !== JSON.stringify(obj[key]) ) {
                                isMatches = false;
                            }
                        } else {
                            if ( currentUrlObj[key] !== obj[key] ) {
                                isMatches = false;
                            }
                        }
    
                    }
                }
                return isMatches;
            }
            if ( options.constructor === Array ) {
                options.forEach(obj => {
                    isMatches = checkMatch(obj);
                });
            } else if ( options.constructor === Object ) {
                isMatches = checkMatch(options)
            } else {
                return false;
            }
            return isMatches;
        }
        ctx.locals.csrf = ctx.csrf;
        await next();
    };
};
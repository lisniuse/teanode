'use strict';

module.exports = () => {
    //判断网站是否安装
    return async function (ctx, next) {
        const goInstallPage = function () {
            ctx.redirect(`/install.html`);
        }
        const siteConfig = ctx.locals.webConfig.site; //await ctx.service.config.findByConfigName("site");
        let apiRoute = ctx.request.path.substring(0, 4);
        let staticRoute = ctx.request.path.substring(0, 8);
        let routeName = ctx.request.path;
        
        if ( apiRoute !== "/api" &&
            routeName !== "/install.html" &&
            staticRoute !== "/public/"
        ) {
            if ( siteConfig ) {
                if ( !siteConfig.installed ) {
                    goInstallPage();
                    return
                }
            } else {
                goInstallPage();
                return
            }
        }
        await next();
    };
};

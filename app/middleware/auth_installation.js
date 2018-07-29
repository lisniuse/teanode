'use strict';

module.exports = () => {
    //判断网站是否安装
    return async function (ctx, next) {
        const goInstallPage = function () {
            ctx.redirect(`/install.html`);
        }
        let apiRoute = ctx.request.path.substring(0, 4);
        let staticRoute = ctx.request.path.substring(0, 8);
        let routeName = ctx.request.path;
        if ( apiRoute !== "/api" &&
            routeName !== "/install.html" &&
            staticRoute !== "/public/"
        ) {
            if ( ctx.locals.webConfig.site ) {
                if ( !ctx.locals.webConfig.site.installed ) {
                    goInstallPage();
                }
            } else {
                goInstallPage();
            }
        }
        await next();
    };
};

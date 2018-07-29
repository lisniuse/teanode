'use strict';

module.exports = () => {
    /**
     * 判断当前地址是否应该屏蔽当前ip，如果屏蔽返回 true
     * @param {Object} options 
     */

    const check = function (options = "") {
        if ( options === "" ) return false;
        const { blackList, ip, path } = options;
        if ( !blackList[ip] ) return false;
        if ( blackList[ip]["all"] ) return true;
        if ( blackList[ip][path] ) return true;
    }

    //阻止ip访问地址
    return async function (ctx, next) {
        const blackList = await ctx.service.cache.getBlackList();
        if ( check({
            blackList: blackList,
            ip: ctx.request.ip,
            path: ctx.request.path
        }) ) {
            ctx.status = 403;
            ctx.body = {
                code: 0,
                msg: "你的操作过于频繁"
            }
            return;
        }
        await next();
    };
};

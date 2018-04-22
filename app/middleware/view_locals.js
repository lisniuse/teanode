'use strict';

module.exports = (options, app) => {
  // tab参数 ，菜单参数
  return async function(ctx, next) {
    ctx.locals.commonVariables = {
        tabs: app.config.tabs,
        tab: ctx.query.tab || '',
        url: ctx.request.url || '/'
    }
    await next();
  };
};
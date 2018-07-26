'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const {
        router,
        controller
    } = app;
    router.get('/', controller.home.index);
    //页面路由
    router.get('/install', controller.install.pageInstall);

    //api路由
    router.get('/api/v1/user/get_email_vercode', controller.user.apiGetEmailValCode);
    router.post('/api/v1/user/sinup', controller.user.apiSinup);
    router.post('/api/v1/install', controller.install.apiInstall);
};

//请求码
/*
errorCode: [
  {
    code: 0,
    msg: "ok"
  }
  {
    code: 101,
    msg: "邮箱已被使用。"
  }
]
*/
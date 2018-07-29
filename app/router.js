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
    router.get('/index.html', controller.home.index);
    router.get('/home.html', controller.home.index);

    //页面路由
    router.get('/install.html', controller.install.pageInstall);

    //api路由
    router.post('/api/v1/user/get_email_vercode', controller.user.apiGetEmailValCode);
    router.post('/api/v1/user/sinup', controller.user.apiSinup);
    router.post('/api/v1/install', controller.install.apiInstall);
};

//请求码
/*
errorCode: [
  {
    code: 0,
    msg: "ok"
  },
  {
    code: 2,
    msg: "未知错误。"
  },
  {
    code: 3,
    msg: "论坛安装失败。"
  },
  {
    code: 4,
    msg: "论坛已经安装过了。"
  }
  {
    code: 101,
    msg: "邮箱已被使用。"
  },
  {
    code: 102,
    msg: "参数错误。"
  },
  {
    code: 103,
    msg: "邮箱验证码错误"
  }
]
*/
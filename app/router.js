'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
    const {
        router,
        controller
    } = app;

    const localStrategy = app.passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/',
    });

    //首页路由
    router.redirect('/', '/index.html', 302);
    router.get('/index.html', controller.home.index); //首页
    
    //论坛板块
    router.get('/category/:categoryName', controller.category.index); //访问板块

    //其他页面
    router.get('/install.html', controller.install.pageInstall); //安装页
    router.get('/user/logout.html', controller.user.signout); //登出页
    router.get('/404.html', controller.error.notfound); //404
    router.post('/passport/local', localStrategy); //登录页

    //用户页面
    router.get('/user/home/:userId', controller.user.pageHome); //用户个人主页
    router.get('/user/personal.html', controller.user.pagePersonal); //用户个人主页
    router.get('/user/message.html', controller.user.pageMessage); //用户的消息页

    //api路由
    router.post('/api/v1/user/get_email_vercode', controller.user.apiGetEmailValCode);
    router.post('/api/v1/user/signup', controller.user.apiSignup);
    router.post('/api/v1/user/signin', controller.user.apiSignin);
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
    code: 100,
    msg: "参数错误"
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
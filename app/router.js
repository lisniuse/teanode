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
    router.get('/api/v1/user/get_email_vercode', controller.user.apiGetEmailValCode);
    router.get('/api/v1/user/sinup', controller.user.apiSinup);

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
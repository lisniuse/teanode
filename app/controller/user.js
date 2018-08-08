'use strict';

const validator = require('validator');
const utility = require('utility');
const uuid = require('uuid');
const Controller = require('egg').Controller;

class UserController extends Controller {

    //获取邮箱验证码
    async apiGetEmailValCode() {
        const {
            ctx,
            service,
            config
        } = this;
        const email = validator.trim(ctx.request.body.email || '').toLowerCase();
        let msg;
        // 验证信息的正确性
        if ([email].some(item => {
                return item === '';
            })) {
            msg = '信息不完整';
        } else if (!validator.isEmail(email)) {
            msg = '邮箱不合法';
        }

        const users = await service.user.getUserByMail(email);

        if ( users ) {
            ctx.status = 200;
            ctx.body = {
                code: 101,
                msg: "邮箱已被使用"
            };
            return;
        }

        const siteConfig = ctx.locals.webConfig.site;
        const verCode = ctx.helper.randNum(100000, 999999);

        //写入缓存 
        await this.service.cache.setVerCode(email, verCode);

        //将当前的ip信息添加到防火墙中并禁止该用户60秒内再次请求该地址。
        await this.service.cache.setBlackList({
            ip: ctx.request.ip,
            path: "/api/v1/user/get_email_vercode",
            time: 1000 * 60
        });
  
        // 发送激活邮件
        await this.service.mail.sendVerCodeMail({
            email: email,
            title: `【${siteConfig.name}】邮箱验证码`,
            content: `【${siteConfig.name}】尊敬的用户，您的验证码是：${verCode}，该验证码30分钟之内有效，如非本人操作，请忽略本邮件。`
        });
        
        ctx.body = {
            code: 0,
            data: "ok"
        }
    }

    //登录API（仅作为用户名密码校验使用）
    async apiSignin() {
        const {
            ctx,
            service,
            config
        } = this;

        //将当前的ip信息添加到防火墙中并禁止该用户3秒内再次请求该地址。
        await this.service.cache.setBlackList({
            ip: ctx.request.ip,
            path: "/api/v1/user/signin",
            time: 1000 * 3
        });
        
        const parameters = {};
        Object.keys(ctx.request.body).forEach(function (key) {
            parameters[key] = validator.trim(ctx.request.body[key] || '');
        });
        ['email', 
        'password']
        .forEach(function (key) {
            if ( parameters[key] === undefined ) parameters[key] = "";
        });
        let msg;
        // 验证信息的正确性
        if (Object.keys(parameters).some(key => {
            return parameters[key] === '';
        })) {
            msg = '参数不正确';
        } else if (!validator.isEmail(parameters.email)) {
            msg = '邮箱不合法';
        }
        // END 验证信息的正确性

        if (msg) {
            ctx.status = 200;
            ctx.body = {
                code: 100,
                msg: msg
            }
            return;
        }

        const user = await ctx.service.user.getUserByMail(parameters.email);

        // 用户不存在
        if (!user) {
            ctx.status = 200;
            ctx.body = {
                code: 100,
                msg: "用户不存在"
            }
            return;
        }

        const passhash = user.password;
        const equal = ctx.helper.bcompare(parameters.password, passhash);

        // 密码不匹配
        if (!equal) {
            ctx.status = 200;
            ctx.body = {
                code: 100,
                msg: "密码不正确"
            }
            return;
        }

        // 用户未验证
        if (!user.active) {
            ctx.status = 200;
            ctx.body = {
                code: 100,
                msg: "用户未验证"
            }
            return;
        }

        ctx.status = 200;
        ctx.body = {
            code: 0,
            msg: "ok"
        }
    }

    //注册操作
    async apiSignup() {
        const {
            ctx,
            service,
            config
        } = this;
        const parameters = {};
        Object.keys(ctx.request.body).forEach(function (key) {
            parameters[key] = validator.trim(ctx.request.body[key] || '');
        });
        ['email', 
        'password',
        'repassword',
        'vercode']
        .forEach(function (key) {
            if ( parameters[key] === undefined ) parameters[key] = "";
        });
        let msg;
        // 验证信息的正确性
        if (Object.keys(parameters).some(key => {
            return parameters[key] === '';
        })) {
            msg = '信息不完整';
        } else if (!validator.isEmail(parameters.email)) {
            msg = '邮箱不合法';
        } else if (parameters.password !== parameters.repassword) {
            msg = '两次密码输入不一致';
        } else if ( !validator.isNumeric(parameters.vercode) ) {
            msg = '邮箱验证码必须是纯数字';
        }
        // END 验证信息的正确性

        if (msg) {
            ctx.status = 200;
            ctx.body = {
                code: 100,
                msg: msg
            }
            return;
        }

        const user = await service.user.getUserByMail(parameters.email);

        if (user) {
            ctx.status = 200;
            ctx.body = {
                code: 101,
                msg: "邮箱已被使用"
            };
            return;
        }

        //从缓存中读取验证码
        const result = await this.service.cache.getVerCodeByEmail(parameters.email);
        if ( !result.email ||
            result.verCode !== Number(parameters.vercode)
        ) {
            ctx.status = 200;
            ctx.body = {
                code: 103,
                msg: "邮箱验证码错误"
            };
            return;
        }
        
        //无报错移除该邮箱的验证码缓存
        await this.service.cache.removeVerCodeByEmail(parameters.email);

        const siteConfig = ctx.locals.webConfig.site;

        const userCount = await this.service.user.count({});

        //正式创建该用户
        const userRes = await this.service.user.create({
            nickname: `第${userCount + 1}位${siteConfig.name}友`,
            avatar: "/public/layui/res/images/avatar/default.jpg",
            email: parameters.email,
            password: parameters.password,
            active: true
        });

        if ( userRes ) {
            ctx.body = {
                code: 0,
                msg: "ok"
            }
        } else {
            ctx.body = {
                code: 2,
                msg: "未知错误"
            }
        }
    }
}

module.exports = UserController;
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
            msg = '信息不完整。';
        } else if (!validator.isEmail(email)) {
            msg = '邮箱不合法。';
        }

        const users = await service.user.getUserByMail(email);

        if ( users ) {
            ctx.status = 200;
            ctx.body = [{
                code: 101,
                msg: "邮箱已被使用。"
            }];
            return;
        }

        const siteConfig = await service.user.getConfigByName("site");
        const verCode = ctx.helper.randNum(100000, 999999);

        //写入缓存
        await this.service.cache.setVerCode(email, verCode);

        // 发送激活邮件
        await this.service.mail.sendVerCodeMail({
            email: email,
            title: `【${siteConfig.siteName}】邮箱验证码`,
            content: `【${siteConfig.siteName}】尊重的用户，您的验证是：${verCode}。如非本人操作，请忽略本邮件。`
        });
        
    }

    //注册操作
    async apiSinup() {
        const {
            ctx,
            service,
            config
        } = this;
        const email = validator.trim(ctx.request.body.email || '').toLowerCase();
        const pass = validator.trim(ctx.request.body.pass || '');
        const rePass = validator.trim(ctx.request.body.re_pass || '');

        let msg;
        // 验证信息的正确性
        if ([pass, rePass, email].some(item => {
                return item === '';
            })) {
            msg = '信息不完整。';
        } else if (!validator.isEmail(email)) {
            msg = '邮箱不合法。';
        } else if (pass !== rePass) {
            msg = '两次密码输入不一致。';
        }
        // END 验证信息的正确性

        if (msg) {
            ctx.status = 422;
            ctx.body = {
                code: 101,
                msg: ""
            }
            return;
        }

        const users = await service.user.getUserByMail(email);

        if (users) {
            ctx.status = 200;
            ctx.body = [{
                code: 101,
                msg: "邮箱已被使用。"
            }];
            return;
        }

        ctx.body = {
            code: 0,
            msg: "ok"
        }
    }
}

module.exports = UserController;
'use strict';

const Service = require('egg').Service;
const mailer = require('nodemailer');

class MailService extends Service {
    async sendMail(data) {
        const {
            ctx,
            config,
            logger
        } = this;

        const emailConfig = ctx.locals.webConfig.email;
        const mailOpts = {
            host: emailConfig.host,
            protocol: emailConfig.protocol,
            auth: {
              user: emailConfig.authUser,
              pass: emailConfig.authPass,
            },
            ignoreTLS: emailConfig.ignoreTLS
        }

        //smtpTransport(mailOpts)
        let opts = `${mailOpts.protocol}://${mailOpts.auth.user}:${mailOpts.auth.pass}@${mailOpts.host}`;
        console.log(opts);
        const transporter = mailer.createTransport(opts);
        //smtps://<发送邮箱>:<授权码>@smtp.qq.com
        for (let i = 1; i < 6; i++) {
            try {
                await transporter.sendMail(data);
                logger.info('send mail success', data);
                break;
            } catch (err) {
                if (i === 5) {
                    logger.error('send mail finally error', err, data);
                    throw new Error(err);
                }
                logger.error('send mail error', err, data);
            }
        }
    }

    async sendVerCodeMail(options = {}) {
        const {
            ctx,
            config
        } = this;

        const siteConfig = ctx.locals.webConfig.site;
        const emailConfig = ctx.locals.webConfig.email;

        const from = `${siteConfig.name} <${emailConfig.authUser}>`;
        const to = options.email;
        const subject = options.title;
        const html = `<p>${options.content}</p>`;

        await this.sendMail({
            from,
            to,
            subject,
            html,
        });
    }

    async sendActiveMail(who, token, name) {
        const {
            config
        } = this;
        const from = `${config.name} <${config.mail_opts.auth.user}>`;
        const to = who;
        const subject = config.name + '社区帐号激活';
        const html = '<p>您好：' + name + '</p>' +
            '<p>我们收到您在' + config.name + '社区的注册信息，请点击下面的链接来激活帐户：</p>' +
            '<a href  = "' + config.host + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
            '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<p>' + config.name + '社区 谨上。</p>';

        await this.sendMail({
            from,
            to,
            subject,
            html,
        });
    }


    async sendResetPassMail(who, token, name) {
        const {
            config
        } = this;
        
        const from = `${config.name} <${config.mail_opts.auth.user}>`;
        const to = who;
        const subject = config.name + '社区密码重置';
        const html = '<p>您好：' + name + '</p>' +
            '<p>我们收到您在' + config.name + '社区重置密码的请求，请在24小时内单击下面的链接来重置密码：</p>' +
            '<a href="' + config.host + '/reset_pass?key=' + token + '&name=' + name + '">重置密码链接</a>' +
            '<p>若您没有在' + config.name + '社区填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<p>' + config.name + '社区 谨上。</p>';

        await this.sendMail({
            from,
            to,
            subject,
            html,
        });
    }
}

module.exports = MailService;
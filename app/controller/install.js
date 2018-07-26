'use strict';

const Controller = require('egg').Controller;

class InstallController extends Controller {
    async index() {
        this.ctx.body = '';
    }

    async pageInstall() {
        await this.ctx.render('/pages/install', {});
    }

    async apiInstall() {
        this.ctx.body = {
            data: this.ctx.request.body
        }
    }
}

module.exports = InstallController;
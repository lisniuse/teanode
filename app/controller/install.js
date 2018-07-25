'use strict';

const Controller = require('egg').Controller;

class InstallController extends Controller {
    async index() {
        this.ctx.body = '';
    }

    async pageInstall() {
        //this.ctx.body = '123';
        await this.ctx.render('/pages/install', {});
    }

    async apiInstall() {
        
    }
}

module.exports = InstallController;
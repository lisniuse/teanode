'use strict';

const Controller = require('egg').Controller;

class SiteController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }
}

module.exports = SiteController;
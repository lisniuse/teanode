'use strict';

const Controller = require('egg').Controller;

class ConfigController extends Controller {
    async index() {
        this.ctx.body = 'hi, egg';
    }
}

module.exports = ConfigController;
'use strict';

const Controller = require('egg').Controller;

class PageController extends Controller {

  async about() {
    let data = { pageTitle: '关于我们' };
    await this.ctx.render('static/about', data);
  }

  // FAQ
  async faq() {
    let data = { pageTitle: 'FAQ' };
    await this.ctx.render('static/faq', data);
  }

  async getstart() {
    let data = { pageTitle: 'Node.js 新手入门' };
    await this.ctx.render('static/getstart', data);
  }

  async robots() {
    this.ctx.type = 'text';
    this.ctx.body = `
  # See http://www.robotstxt.org/robotstxt.html for documentation on how to use the robots.txt file
  #
  # To ban all spiders from the entire site uncomment the next two lines:
  # User-Agent: *
  # Disallow: /
`;
  }
  
}

module.exports = PageController;

'use strict';

const Service = require('egg').Service;

class CategoryService extends Service {

    /*
     * 新建种类
     */
    async create(categoryObj) {
        return this.ctx.model.Category.insertMany(categoryObj);
    }

    /**
     * 查询种类
     */
    async find(query) {
        return this.ctx.model.Category.find(query)
        .exec();
    }
}


module.exports = CategoryService;
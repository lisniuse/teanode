'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {

    /*
     * 新建文章
     */
    async create(articleObj) {
        const article = new this.ctx.model.Article();
        for (const key in articleObj) {
            article[key] = articleObj[key];
        }
        return article.save();
    }

    /*
     * 根据关键字，获取一组文章
     * Callback:
     * - err, 数据库异常ß
     * - articles, 文章列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[articles]} 承载文章列表的 Promise 对象
     */
    async getArticlesByQuery(query, opt) {
        return this.ctx.model.Article.find(query, '', opt).exec();
    }

    /**
     * 查询文章
     */
    async find(query, pageNum = 0, pageSize = 10) {
        return this.ctx.model.Article.find(query)
        .populate('userId')
        .sort({'createTime':-1})
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .exec();
    }

    /*
     * 根据文章Id查找文章
     * @param {Object} obj
     */
    async getArticleById(articleId) {
        return this.ctx.model.Article.findById(articleId)
        .populate('userId')
        .exec();
    }


    /**
     * 更新文章信息
     */
    async update(articleId, updateInfo) {
        if (!articleId) {
            return;
        }
        const query = { _id: articleId };
        const update = updateInfo;
        return this.ctx.model.Article.update(query, update).exec();
    }

    /**
     * 通过文章Id删除文章
     */
    async remove(articleId) {
        return this.ctx.model.Article.findOneAndRemove({
            _id: articleId
        }).exec();
    }

    /**
     * 统计
     */
    async count(query) {
        return this.ctx.model.Article.count(query).exec();
    }
}

module.exports = ArticleService;
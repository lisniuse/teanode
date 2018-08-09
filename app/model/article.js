'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 文章表
    */
    const ArticleSchema = new Schema({
        categoryId:{
            type: mongoose.Schema.ObjectId,
            ref: 'Category'
        }, //所属板块/种类的id
        order: { type: Number, default: 0 }, //排序权重
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }, //所属用户id
        
        title: { type: String }, //文章的标题
        content: { type: String }, //文章内容

        starCount: { type: Number, default: 0 }, //被点赞数量
        commentCount: { type: Number, default: 0 }, //被评论数量
        collCount: { type: Number, default: 0}, //被收藏的数量

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    ArticleSchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    ArticleSchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Article', ArticleSchema);
};

'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 评论表
    */
    const CommentSchema = new Schema({
        articleId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Article'
        }, //所属的文章的id

        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }, //发布这条评论的用户Id

        content: { type: String }, //评论的内容

        starCount: { type: Number, default: 0 }, //点赞数量

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    CommentSchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    CommentSchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Comment', CommentSchema);
};
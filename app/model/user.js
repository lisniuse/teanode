'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /**
     * 用户表
     */
    const UserSchema = new Schema({
        email: { type: String }, //邮箱作为登陆用户名
        password: { type: String }, //密码
        nickname: { type: String }, //昵称
        url: { type: String }, //网址（可以是个人网站也可以是自己编辑过的WIKI）
        location: { type: String }, //所在地
        signature: { type: String }, //个人签名
        sex: { type: Number, default: 1 }, //性别 1男、2女
        age: { type: Number, default: 18}, //年龄
        birthday: { type: Number }, //生日
        avatar: { type: String }, //头像
        power: { type: Array }, //权限
        score: { type: Number, default: 0 }, //积分

        starArticleIds: { type: Array }, //点赞过的文章
        collArticleIds: { type: Array }, //收藏的文章

        followers: { type: Array }, //关注者
        signatureDays: { type: Number }, //连续签到天数

        createTime: { type: Number },
        updateTime: { type: Number },

        active: { type: Boolean, default: false }, //是否已经激活
    });

    UserSchema.index({ email: 1 }, { unique: true });
    UserSchema.index({ score: -1 });

    UserSchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    UserSchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('User', UserSchema);
};
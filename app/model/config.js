'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /**
     * 站点配置信息表
     */
    const ConfigSchema = new Schema({
        name: { type: String }, //配置名称
        content: { type: Object }, //配置信息
        /*
        //站点配置
        site: {
            name: "", //站点名称
            description: "", //站点描述
            keywords: "", //站点关键字
            logo: "", //站点Logo
            icon: "", //站点图标
            domain: "", //站点域名
            sessionSecret: "", //用户加密因子
            allowSignUp: "", //是否允许直接注册，跳过邮箱验证
            installed: false, //是否安装过系统
        },
        //邮件配置
        email: {
            host: 'smtp.126.com',
            port: 25,
            authUser: 'club@126.com',
            authPass: 'club',
            ignoreTLS: true,
        }
        //
        */
        createTime: { type: Number },
        updateTime: { type: Number }
    });

    ConfigSchema.index({ name: 1 }, { unique: true });

    ConfigSchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    ConfigSchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Config', ConfigSchema);
};
'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /**
     * 论坛板块表
     */
    const CategorySchema = new Schema({
        name: { type: String }, //板块名称
        alias: { type: String }, //英文别名
        order: { type: Number }, //板块序号

        createTime: { type: Number },
        updateTime: { type: Number }
    });

    CategorySchema.index({ alias: 1 }, { unique: true });
    
    CategorySchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now;
        this.updateTime = now;
        next();
    });

    CategorySchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Category', CategorySchema);
};
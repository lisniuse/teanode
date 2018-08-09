'use strict';

module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    /*
    * 签到表
    */
    const SignatureSchema = new Schema({
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }, //签到的用户Id

        createTime: { type: Number },
        updateTime: { type: Number },
    });

    SignatureSchema.pre('save', function (next) {
        const now = new Date().getTime();

        this.createTime = now; //不记录时分秒，只记录日期。
        this.updateTime = now;
        next();
    });

    SignatureSchema.pre('update', function (next) {
        const now = new Date().getTime();
        this.updateTime = now;
        next();
    });

    return mongoose.model('Signature', SignatureSchema);
};
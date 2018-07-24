'use strict';

const Service = require('egg').Service;

class UserService extends Service {

    /*
     * 新建用户
     */
    async create(userObj) {
        userObj.password = this.ctx.helper.bhash(userObj.password);
        const user = new this.ctx.model.User();
        for (const key in userObj) {
            user[key] = userObj[key];
        }
        return user.save();
    }

    /**
     * 通过PropertyId查询User
     */
    async getUsersByUserIdPropertyId(userId, propertyId) {
        return this.ctx.model.User.findOne({
            $and: [
                {
                    _id: userId,
                },
                {
                    starPropertys: propertyId
                }
            ]
        }).exec();
    }

    /*
     * 根据关键字，获取一组用户
     * Callback:
     * - err, 数据库异常
     * - users, 用户列表
     * @param {String} query 关键字
     * @param {Object} opt 选项
     * @return {Promise[users]} 承载用户列表的 Promise 对象
     */
    async getUsersByQuery(query, opt) {
        return this.ctx.model.User.find(query, '', opt).exec();
    }

    /*
     * 根据邮箱，查找用户
     * @param {String} email 邮箱地址
     * @return {Promise[user]} 承载用户的 Promise 对象
     */
    async getUserByMail(email) {
        return this.ctx.model.User.findOne({ email }).exec();
    }

    /*
     * 根据用户Id查找用户
     * @param {String} UserId
     */
    async getUserById(id) {
        return this.ctx.model.User.findOne({ _id: id }).exec();
    }

    /**
     * 更新用户token
     * @param {String} userId
     */
    async updateToken(userId, token) {
        const query = { _id: userId };
        const update = { accessToken: token };
        return this.ctx.model.User.findByIdAndUpdate(query, update).exec();
    }


    /**
     * 更新用户信息
     */
    async update(userId, updateInfo) {
        if (!userId) {
            return;
        }
        const query = { _id: userId };
        const update = updateInfo;
        return this.ctx.model.User.update(query, update).exec();
    }

    /**
     * 通过Id删除一个用户
     */
    async remove(userId) {
        return this.ctx.model.User.findOneAndRemove({
            _id: userId
        }).exec();
    }

    /**
     * 查询用户
     */
    async find(query) {
        return this.ctx.model.User.find(query).exec();
    }

    /**
     * 统计
     */
    async count() {
        return this.ctx.model.User.count({}).exec();
    }
}

module.exports = UserService;

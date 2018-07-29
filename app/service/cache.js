'use strict';

const Service = require('egg').Service;

/**
 * 从数组中删除包含该邮箱的对象
 */
const deleteEmail = function (array, email) {
    let index = "";
    let newArr = [];
    array.forEach(function (obj, idx) {
        if ( obj.email !== email ) {
            newArr.push(obj);
        }
    });
    return newArr;
}

class CacheService extends Service {
    /**
     * 设置验证码
     * @param {string} email 
     * @param {string} verCode 
     */
    async setVerCode(email, verCode) {
        const { redis } = this.app;
        const result = await redis.get("verCodes");
        let verCodes = result ? JSON.parse(result) : [];
        //覆盖
        verCodes = deleteEmail(verCodes, email);
        const now = new Date();
        //30分钟过期时间
        let nextMinute = new Date(now.getTime() + 1000 * 60 * 30);
        verCodes.push({
            email: email,
            verCode: verCode,
            expiryTime: nextMinute.getTime()
        });
        await redis.set("verCodes", JSON.stringify(verCodes));
    }

    /**
     * 读取验证码
     * @param {string} email 
     */
    async getVerCodeByEmail(email) {
        const { redis } = this.app;
        const result = await redis.get("verCodes");
        let verCodes = result ? JSON.parse(result) : [];
        let findObj = {};
        verCodes.forEach(element => {
            if ( element.email === email ) {
                findObj = element;
            }
        });
        const now = (new Date()).getTime();
        //过期自动删除验证码
        if ( now > findObj.expiryTime ) {
            verCodes = deleteEmail(verCodes, email);
            await redis.set("verCodes", JSON.stringify(verCodes));
            return {};
        }
        return findObj;
    }

    /**
     * 从缓存移除验证码
     * @param {string} email 
     */
    async removeVerCodeByEmail(email) {
        const { redis } = this.app;
        const result = await redis.get("verCodes");
        let verCodes = result ? JSON.parse(result) : [];
        //覆盖
        verCodes = deleteEmail(verCodes, email);
        console.log(verCodes);
        await redis.set("verCodes", JSON.stringify(verCodes));
    }

    /**
     * 设置ip黑名单
     * @param {Object}} options 
     */
    async setBlackList(options) {
        const { redis } = this.app;
        const result = await redis.get("blackList");
        const now = (new Date()).getTime();
        let blackList = result ? JSON.parse(result) : {};
        if ( !blackList[options.ip] ) blackList[options.ip] = {};
        blackList[options.ip][options.path] = now + options.time;
        await redis.set("blackList", JSON.stringify(blackList));
    }

    /**
     * 读取ip黑名单
     * @param {String} ip 
     */
    async getBlackList() {
        const { redis } = this.app;
        const now = (new Date()).getTime();
        let result = await redis.get("blackList");
        result = result === "[object Object]" ? {} : result;
        let blackList = result ? JSON.parse(result) : {};
        //过滤掉过期规则
        for(let ip in blackList) {
            for ( let path in blackList[ip] ) {
                if ( now >= Number(blackList[ip][path]) &&
                    Number(blackList[ip][path]) !== 0
                ) {
                    delete blackList[ip][path];
                }
            }
        }
        await redis.set("blackList", JSON.stringify(blackList));
        return blackList;
    }

    /**
     * 从黑名单中删除一条规则
     */
    async removeRuleByIpAndPath(options) {
        const { redis } = this.app;
        const result = await redis.get("blackList");
        let blackList = result ? JSON.parse(result) : {};
        delete blackList[options.ip][options.path];
        await redis.set("blackList", JSON.stringify(blackList));
    }

    /**
     * 清空黑名单
     */
    async removeAllRules() {
        const { redis } = this.app;
        await redis.set("blackList", "{}");
    }
}

module.exports = CacheService;

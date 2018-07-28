'use strict';

const Service = require('egg').Service;

class ConfigService extends Service {

    /*
     * 新建配置
     */
    async create(configObj) {
        const config = new this.ctx.model.Config();
        for (const key in configObj) {
            config[key] = configObj[key];
        }
        return config.save();
    }

    /**
     * 查询配置，根据配置名称
     */
    async findByConfigName(configName) {
        return this.ctx.model.Config.findOne({
            name: configName
        }).exec();
    }
}


module.exports = ConfigService;
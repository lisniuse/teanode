'use strict';

const path = require('path');

module.exports = appInfo => {
    const config = exports = {};

    //设置默认主题（填写view目录下主题的文件夹名）
    config.themeName = "layui"

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1532073849273_2285';

    // add your config here
    config.middleware = [];

    config.security = {
        csrf: {
            ignore: '/api/*',
        },
    };

    config.view = {
        defaultViewEngine: 'ejs',
        root: [
            path.join(appInfo.baseDir, 'app/view'),
            path.join(appInfo.baseDir, 'app/view/' + config.themeName),
        ].join(','),
        mapping: {
            '.html': 'ejs',
        },
    };

    config.mongoose = {
        url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/teanode',
        options: {
          server: { poolSize: 20 },
        },
    };

    // add your config here
    config.middleware = [
        'loadConfig',
        'authInstallation'
    ];




    
    return config;
};
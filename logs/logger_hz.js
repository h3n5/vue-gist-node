/**
 * log4js 日志输出配置文件
 * @type {exports}
 */
var log4js = require('log4js');
/*
//以下为v1.0配置方式
log4js.configure({
    appenders: [
        { type: 'console' }, {
            type: 'dateFile',
            filename: __dirname+'/txt/log_hongzan',
            pattern: '_yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            category: 'logger'
        }
    ],
    replaceConsole: true
});*/

//以下为v2.0配置方式
log4js.configure({
    appenders: {
        ruleConsole: {type: 'console'},
        ruleFile: {
            type: 'dateFile',
            filename: __dirname+'/txt/log_hongzan',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}
    }
});

module.exports = log4js.getLogger('logger');
/*包管理*/
/*
var useDao = require('../dao/useDao'),
    util = require('../util/util'),
    async = require('async'),
    request = require('request'),
    settings = require('../conf/settings'),
    logger = require('../logs/logger_hz.js');
*/

module.exports = {
    useDao:require('../dao/useDao'),
    util:require('../util/util'),
    settings:require('../conf/settings'),
    logger:require('../logs/logger_hz.js'),
    async:require('async'),
    request:require('request'),
    multer:require("multer"),
    uuidv1:require('uuid/v1')
};
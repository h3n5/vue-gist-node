"use strict";
var pub = require('../public');
var useDao = pub.pack.useDao,
    util =pub.pack.util,
    settings =pub.pack.settings,
    logger = pub.pack.logger;

module.exports = {
    checkPerm: function (chkName, permString) {//根据权限显示控制方法
        return true;
        if(permString.indexOf("/"+chkName+"/") > -1){
            return true;
        } else {
            return false;
        }
    },auth_check: function (req, res, next) {//权限验证
        var cookie = req.cookies[settings.authParam.cookie_name];
        if (!cookie) {
            logger.debug("cookie 过期失效");
            return res.render('login');
        }
        var auth_token = util.decrypt(cookie, settings.authParam.session_secret);//解密
        var auth = auth_token.split('\t')[0];
        if (req.session.id == auth && req.session.id) {
            return next();
            if(!module.exports.checkPerm(req.url.replace("/",""),req.session.permUrl)){
                return res.render('noAuth');//无访问权限
            }else{
                return next();
            }
        }else{
            req.session.destroy();
            return res.render('login');
        }
    },resRender: function (req,res,route,jsonData,backPara) {
        jsonData.chkPerm=function (chkName) {//验证权限
            return module.exports.checkPerm(chkName,req.session.permUrl);
        };
        jsonData.backPara=backPara;//放入查询参数,可为空值
        res.status(200).render(route,jsonData);
    },pageFunc: function (page) {//分页方法
        var pageObj={};
        var curPage=1,pageSize=settings.page.pageSize,search={};
        if (!util.isEmpty(page.curPage)){
            curPage = Number(page.curPage);
        }
        if (!util.isEmpty(page.pageSize)){//当指定分页大小
            pageSize = Number(page.pageSize);
        }
        if (!util.isEmpty(page.search)){//当指定分页大小
            search = JSON.parse(page.search);
        }
        pageObj.curPage=curPage;
        pageObj.pageSize=pageSize;
        pageObj.pageOffset = (curPage - 1) * pageSize;
        pageObj.sqlLimit=" limit "+pageObj.pageSize +" offset "+pageObj.pageOffset;//取数据范围

        pageObj.sqlFunc=function(sqlPage){//执行方法
            return function (callback) {
                useDao.sql(sqlPage, function (err, result) {
                    result.pageInfo={"search":search,"pageTotal":Math.ceil(Number(result[0].count) / pageObj.pageSize),"curPage":pageObj.curPage,"count":result[0].count,"pageSize":pageObj.pageSize};
                    callback(null, result);
                });
            }
        }
        return pageObj;
    },searchFunc: function (searchInfo,mapName) {//searchInfo:搜索字段信息,mapName:sql字段映射
        searchInfo=util.isEmpty(searchInfo)?{}:JSON.parse(searchInfo);
        var searchObj={};
        var strArr=[];
        strArr.push(" 1=1");
        for (var key in searchInfo){
            var name=util.isEmpty(mapName[key])?key:mapName[key];
            strArr.push(" AND "+name+" like '%"+searchInfo[key]+"%' ");
        }
        searchObj.searchFilter=strArr.join("");
        return searchObj;
    }

};

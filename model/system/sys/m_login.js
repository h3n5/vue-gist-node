"use strict";
var pub = rootReq('model/public');
var useDao = pub.pack.useDao,
    util =pub.pack.util,
    async =pub.pack.async,
    settings =pub.pack.settings,
    logger = pub.pack.logger;
var viewsPath="system/sys";//渲染views文件路径

module.exports = {
    login: function (req, res, next) {//登录页面
        res.render("login");
    },
    logout: function (req, res, next) {//退出
        req.session.destroy();
        res.clearCookie(settings.authParam.cookie_name,{path: '/'});
        res.redirect('login');
    },
    loginCheck: function (req, res, next) {//:登录检查
        var pData=eval('(' + req.body.postData + ')');
        var companyName = pData.companyName;
        var loginName = pData.loginName;
        var pswd = pData.pswd;
        if(companyName==""||loginName == '' || pswd == ''){
            res.jsonp({result:"ERROR"});
            return;
        }
        var userPwd = util.md5(loginName + '#' + pswd);
        var sqlStr="SELECT pu.*,GROUP_CONCAT(pp.permUrl) as permUrl from plat_user pu " +
            "LEFT JOIN plat_company pc ON pu.companyId=pc.id LEFT JOIN plat_role pr on FIND_IN_SET(pr.id,pu.roleIds) " +
            "LEFT JOIN plat_role_permission prp ON pr.id=prp.rid LEFT JOIN plat_permission pp ON prp.pid=pp.id AND pp.isUse=1 " +
            "WHERE pu.loginName='"+loginName+"' AND pu.passWord='"+userPwd+"' AND pc.compName='"+companyName+"' AND pu.isUse=1";
        async.parallel([
                function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                }
            ]
            , function (err, result){
                if(result[0][0].loginName===loginName){
                    try {
                        var resData=result[0][0];
                        var auth_token = util.encrypt(req.session.id, settings.authParam.session_secret);//加密
                        res.cookie(settings.authParam.cookie_name, auth_token, {path: '/', maxAge: 8 * 1000 * 60 * 60});//8小时长

                        req.session.userId = resData.id;//必须赋值一次,req.session才会相同值
                        req.session.userName = resData.userName;
                        req.session.loginName = resData.loginName;
                        req.session.companyId = resData.companyId;
                        req.session.permUrl = resData.permUrl;

                        res.jsonp({url: "/index", status: "ok"});
                    } catch (error) {
                        res.jsonp({url: "/", status: "err"});
                    }
                }else{
                    res.jsonp({url: "/", status: "err"});
                }
            });

    },index: function (req, res, next) {//登录页面
        res.render("index");
    },

};

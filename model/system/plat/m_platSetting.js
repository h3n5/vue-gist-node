"use strict";
var pub = rootReq('model/public');
var useDao = pub.pack.useDao,
    util =pub.pack.util,
    async =pub.pack.async,
    settings =pub.pack.settings,
    logger = pub.pack.logger;
var sysUtil = rootReq('model/sysUtil/m_sys_pub');
var viewsPath="system/plat";//渲染views文件路径

module.exports = {
    plat_setting: function (req, res, next) {//平台设置
        sysUtil.resRender(req,res,viewsPath+'/plat_setting',{});
    },plat_compList: function (req, res, next) {//：公司列表
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj = sysUtil.pageFunc({ "curPage": curPage, "search": search});
        var searchObj=sysUtil.searchFunc(search,{"compName":"pc.compName"});

        var sqlStr="SELECT pc.*,GROUP_CONCAT(pr.roleName) as roleName FROM plat_company pc LEFT JOIN plat_role pr ON FIND_IN_SET(pr.id,pc.roleIds) where "+searchObj.searchFilter+" GROUP BY pc.id"+pageObj.sqlLimit;
        var sqlRole="SELECT * FROM plat_role where type='company'";//为公司角色
        var sqlPage="SELECT count(*) as count FROM plat_company pc where " +searchObj.searchFilter;//分页sql

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },roleData: function (callback) {
                    useDao.sql(sqlRole, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/plat_compList',{
                    listData:result.listData,
                    roleData:result.roleData,
                    pageInfo:result.page.pageInfo
                });
            });
    },plat_compEdit: function (req, res, next) {//：保存编辑信息
        var pData=req.body.postData;
        var id=pData.id;
        var sqlCol="compName='"+pData.compName+"',roleIds='"+pData.roleIds+"',isUse="+pData.isUse;
        useDao.updateById("plat_company",id,sqlCol, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },plat_compAdd: function (req, res, next) {//：增加信息
        var pData=req.body.postData;
        var sqlCol=" compName,roleIds,isUse";
        var sqlVal="'"+pData.compName+"','"+pData.roleIds+"','"+pData.isUse+"'";
        useDao.insert("plat_company",sqlCol,sqlVal, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },plat_permList: function (req, res, next) {//权限url管理
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        }
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj=sysUtil.pageFunc({"curPage":curPage,"search":search});
        var searchObj=sysUtil.searchFunc(search,{});

        var sqlStr="SELECT * FROM plat_permission where "+searchObj.searchFilter+pageObj.sqlLimit;
        var sqlPage="SELECT count(*) as count FROM plat_permission where"+searchObj.searchFilter;

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/plat_permList',{
                    listData:result.listData,
                    pageInfo:result.page.pageInfo
                });
            });
    },plat_permEdit: function (req, res, next) {//：保存编辑权限信息
        var pData=req.body.postData;
        var id=pData.id;
        var sqlCol="permName='"+pData.permName+"',permUrl='"+pData.permUrl+"',isUse="+pData.isUse;
        useDao.updateById("plat_permission",id,sqlCol, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },plat_permAdd: function (req, res, next) {//：增加权限信息
        var pData=req.body.postData;
        var sqlCol=" permName,permUrl,isUse";
        var sqlVal="'"+pData.permName+"','"+pData.permUrl+"','"+pData.isUse+"'";
        useDao.insert("plat_permission",sqlCol,sqlVal, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },plat_permDel: function (req, res, next) {//:删除权限
        var vid = req.body.vid;
        var sql2="DELETE FROM plat_permission where id="+vid;
        async.auto([
                function (callback) {
                    useDao.sql(sql2, function (err, result) {
                        callback(null, result);
                    });
                }
            ]
            , function (err, result) {
                res.json({result: err?"err":"ok"});
            });
    },plat_rolePermList: function (req, res, next) {//公司权限管理
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        }
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj=sysUtil.pageFunc({"curPage":curPage,"search":search});
        var searchObj=sysUtil.searchFunc(search,{"compName":"pc.compName"});

        var sqlStr="SELECT r.*,GROUP_CONCAT(m.id) as pid,GROUP_CONCAT(m.permUrl) as permUrl,GROUP_CONCAT(m.permName SEPARATOR ' | ') as permName " +
            "FROM plat_role r LEFT JOIN plat_role_permission p on r.id=p.rid LEFT JOIN plat_permission m on p.pid=m.id and m.isUse=1 " +
            "where "+searchObj.searchFilter+" GROUP BY r.id "+pageObj.sqlLimit;
        var sqlPerm="SELECT pp.* from plat_company pc LEFT JOIN plat_role pr on  FIND_IN_SET(pr.id,pc.roleIds) " +
            "LEFT JOIN  plat_role_permission prp on pr.id=prp.rid LEFT JOIN  plat_permission pp on prp.pid=pp.id " +
            "WHERE  pp.isUse=1 GROUP BY pp.id";

        var sqlPage="SELECT count(*) as count FROM plat_role where "+searchObj.searchFilter;

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },hasPermData: function (callback) {
                    useDao.sql(sqlPerm, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/plat_rolePermList',{
                    listData:result.listData,
                    hasPermData:result.hasPermData,
                    pageInfo:result.page.pageInfo
                });
            });
    },plat_roleList: function (req, res, next) {//角色管理
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        }
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj=sysUtil.pageFunc({"curPage":curPage,"search":search});
        var searchObj=sysUtil.searchFunc(search,{"roleName":"pr.roleName"});

        var sqlStr="SELECT pr.*,pc.compName FROM plat_role pr LEFT JOIN plat_company pc on pr.companyId=pc.id where pr.type <>'admin' and "+searchObj.searchFilter+" ORDER BY pr.companyId "+pageObj.sqlLimit;
        var sqlPage="SELECT count(*) as count FROM plat_role pr where  pr.type <>'admin' and "+searchObj.searchFilter;
        var sqlComp="SELECT * FROM plat_company pc";

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },compData: function (callback) {
                    useDao.sql(sqlComp, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/plat_roleList',{
                    listData:result.listData,
                    compData:result.compData,
                    pageInfo:result.page.pageInfo
                });
            });
    },plat_roleEdit: function (req, res, next) {//：保存编辑角色信息
        var pData=req.body.postData;
        var dataId=pData.id;
        var sqlCol="roleName='"+pData.roleName+"',type='"+pData.type+"',companyId="+pData.companyId;
        useDao.updateById("plat_role",dataId,sqlCol, function (err,result) {
            res.json({result:'ok'});
        });
    },plat_roleAdd: function (req, res, next) {//：保存角色信息
        var pData=req.body.postData;
        var sqlCol=" roleName,companyId,type";
        var sqlVal="'"+pData.roleName+"','"+pData.companyId+"','"+pData.type+"'";
        useDao.insert("plat_role",sqlCol,sqlVal, function (err,result) {
            res.json({result:'ok'});
        });
    },plat_RoleDel: function (req, res, next) {//:删除角色
        var vid = req.body.vid;
        var sql1="DELETE FROM plat_role where id="+vid;
        var sql2="DELETE FROM plat_role_permission where rid="+vid;
        async.auto([
                function (callback) {
                    useDao.sql(sql1, function (err, result) {
                        callback(null, result);
                    });
                },function (callback) {
                    useDao.sql(sql2, function (err, result) {
                        callback(null, result);
                    });
                }
            ]
            , function (err, result) {
                var resStr="ok";
                if (err) {resStr="err";}
                res.json({result: resStr});
            });
    },plat_userFrame: function (req, res, next) {//平台用管理
        res.render(viewsPath+'/plat_userFrame');
    },tree_plat_user: function (req, res, next) {//平台用户树
        var sqlStr="SELECT c.compName,d.deptName as name,d.id as id,d.parentId FROM plat_company c LEFT JOIN plat_department d on d.companyId=c.id";
        async.parallel({
                data: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                }
            }
            , function (err, result) {
                //result.data.push({"name":result.data[0].compName,"id":1});//加入顶层公司
                var treeData=util.toTree(result.data);
                res.render('template/tree_plat_user', {
                    treeData:treeData
                });
            });
    },plat_userList: function (req, res, next) {//平台用户管理
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        }
        var deptId=Number(req.query.deptId);
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj=sysUtil.pageFunc({"curPage":curPage,"search":search});
        var searchObj=sysUtil.searchFunc(search,{});

        var sqlStr="SELECT pu.*,pd.deptName,pc.compName FROM plat_user pu LEFT JOIN plat_department pd on pu.deptId=pd.id " +
            "LEFT JOIN plat_company pc ON pu.companyId=pc.id WHERE "+searchObj.searchFilter+pageObj.sqlLimit;
        var sqlRole="SELECT * FROM plat_role";
        var sqlPage="SELECT count(*) as count FROM plat_user where "+searchObj.searchFilter;
        var sqlDept="SELECT c.compName,d.deptName,d.id,d.parentId FROM plat_company c LEFT JOIN plat_department d on d.companyId=c.id";

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },roleData: function (callback) {
                    useDao.sql(sqlRole, function (err, result) {
                        callback(null, result);
                    });
                },deptData: function (callback) {
                    useDao.sql(sqlDept, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/plat_userList',{
                    listData:result.listData,
                    roleData:result.roleData,
                    deptData:result.deptData,
                    deptId:deptId,
                    pageInfo:result.page.pageInfo
                });
            });
    },plat_userAdd: function (req, res, next) {//：添加用户信息
        var company_id=req.session.companyId;
        var pData=req.body.postData;
        var sqlCol=" userName,loginName,passWord,createTime,tel,sex,isUse,deptId,companyId,roleIds,roleNames";
        var passWord=util.md5(pData.loginName + '#' + pData.loginName+"123456");//初始化密码
        var sqlVal="'"+pData.userName+"','"+pData.loginName+"','"+passWord+"','"+util.getNowFormatDate()+"','"
            +pData.tel+"','"+pData.sex+"','"+pData.isUse+"','"+pData.deptId+"','"+company_id+"','"+pData.roleIds+"','"+pData.roleNames+"'";

        useDao.insert("plat_user",sqlCol,sqlVal, function (err,result) {
            res.json({result:'ok'});
        });
    },plat_userEdit: function (req, res, next) {//：保存编辑用户信息
        var pData=req.body.postData;
        var dataId=pData.id;
        var sqlCol="userName='"+pData.userName+"',loginName='"+pData.loginName+"',tel='"+pData.tel+"',sex='"+pData.sex+
            "',isUse='"+pData.isUse+"',deptId='"+pData.deptId+"',roleIds='"+pData.roleIds+"',roleNames='"+pData.roleNames+"'";

        useDao.updateById("plat_user",dataId,sqlCol, function (err,result) {
            res.json({result:'ok'});
        });

    },plat_userDel: function (req, res, next) {//:删除用户
        var vid = req.body.vid;
        var sql1="DELETE FROM plat_user where id="+vid;
        async.auto([
                function (callback) {
                    useDao.sql(sql1, function (err, result) {
                        callback(null, result);
                    });
                }
            ]
            , function (err, result) {
                res.json({result: err?"err":"ok"});
            });
    }

};

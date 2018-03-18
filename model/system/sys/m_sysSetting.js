"use strict";
var pub = rootReq('model/public');
var useDao = pub.pack.useDao,
    util =pub.pack.util,
    async =pub.pack.async,
    settings =pub.pack.settings,
    logger = pub.pack.logger;
var sysUtil = rootReq('model/sysUtil/m_sys_pub');
var viewsPath="system/sys";//渲染views文件路径

module.exports = {
      sys_setting: function (req, res, next) {//系统设置
        sysUtil.resRender(req,res,viewsPath+'/sys_setting',{});
    },sys_deptFrame: function (req, res, next) {//部门管理
        res.render(viewsPath+'/sys_deptFrame');
    },sys_deptEdit: function (req, res, next) {//部门管理
        var id= req.query.id;
        var sqlStr="SELECT * FROM plat_department WHERE id="+id;
        async.parallel({
            datas: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        },function (err, result) {
            if(id==-1){
                res.render(viewsPath+'/sys_deptEdit');
            }else{
                res.render(viewsPath+'/sys_deptEdit', {
                    data:result.datas[0]
                });
            }
        });
    },setDeptAdd: function (req, res, next) {
        var parenId = req.query.parenId;
        res.render("setDeptAdd",{parenId:parenId});
    },sys_deptAdd: function (req, res, next) {
        var company_id=req.session.companyId;

        var pData=req.body.postData;
        var sqlCol=" deptName,parentId,companyId";
        var sqlVal="'"+pData.deptName+"',"+pData.parentId+","+company_id;
        useDao.insert("plat_department",sqlCol,sqlVal, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },sys_deptEditSave: function (req, res, next) {
        var pData=req.body.postData;
        var id=pData.id;
        var sqlCol="deptName='"+pData.deptName+"'";
        useDao.updateById("plat_department",id,sqlCol, function (err,result) {
            res.json({result: err?"err":"ok"});
        });
    },tree_sys_dept: function (req, res, next) {//部门树
        var company_id=req.session.companyId;
        var sqlStr="SELECT * FROM plat_department where companyId="+company_id+" or id=1";
        async.parallel({
                data: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                }
            }
            , function (err, result) {
                var treeData=util.toTree(result.data);
                res.render('template/tree_sys_dept', {
                    treeData:treeData
                });
            });
    },checkDelDept: function(req, res, next) {
        var pData=req.body.postData;
        var vid=pData.id;
        var sql="select count(*) as count from plat_department where parentId="+vid;
        useDao.sql(sql, function (err, result) {
            var str="ok";
            if(result[0].count>0){str="no";}
            res.json({result:str});
        });
    },delDeptDept: function (req, res, next) {//:删除部门
        var vid = req.body.vid;
        var sql2="DELETE FROM plat_department where id="+vid;
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
    },sys_compFrame: function (req, res, next) {//公司管理
        res.render(viewsPath+'/sys_compFrame');
    },sys_compEdit: function (req, res, next) {//公司管理
        var id= req.query.id;
        var sqlStr="SELECT * FROM plat_department WHERE id="+id+" AND parentId=1";
        async.parallel({
            datas: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        },function (err, result) {
            if(id==-1){
                res.render(viewsPath+'/sys_compEdit');
            }else{
                res.render(viewsPath+'/sys_compEdit', {
                    data:result.datas[0]
                });
            }
        });
    },sys_compAdd: function (req, res, next) {
        res.render("sys_compAdd");
    },tree_sys_comp: function (req, res, next) {//公司管理树
        var company_id=req.session.companyId;
        var sqlStr="SELECT c.compName,d.deptName as name,d.id as id,d.parentId FROM plat_company c LEFT JOIN plat_department d on d.companyId=c.id WHERE d.parentId=1 and c.id="+company_id;
        sqlStr = "SELECT * FROM plat_department where companyId="+company_id+" and parentId=1 or id=1";

        async.parallel({
                data: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                }
            }
            , function (err, result) {
                var treeData=util.toTree(result.data);
                res.render('template/tree_sys_comp', {
                    treeData:treeData
                });
            });
    },sys_rolePermList: function (req, res, next) {//公司权限管理
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
            "where r.companyId="+company_id+" and "+searchObj.searchFilter+" GROUP BY r.id "+pageObj.sqlLimit;
        var sqlPerm="SELECT pp.* from plat_company pc LEFT JOIN plat_role pr on  FIND_IN_SET(pr.id,pc.roleIds) " +
            "LEFT JOIN  plat_role_permission prp on pr.id=prp.rid LEFT JOIN  plat_permission pp on prp.pid=pp.id " +
            "WHERE pc.id="+company_id+" and pp.isUse=1 GROUP BY pp.id";
        var sqlPage="SELECT count(*) as count FROM plat_role where companyId="+company_id+" and "+searchObj.searchFilter;

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
                sysUtil.resRender(req,res,viewsPath+'/sys_rolePermList',{
                    listData:result.listData,
                    hasPermData:result.hasPermData,
                    pageInfo:result.page.pageInfo
                });
            });
    },rolePermDel: function (req, res, next) {//:清空角色权限
        var vid = req.body.vid;
        var sql2="DELETE FROM plat_role_permission where rid="+vid;
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
    },rolePermSave: function (req, res, next) {//:保存角色权限
        var pData=req.body.postData;
        var roleId=pData.id;

        if(util.isEmpty(roleId)){res.json({"result":"err"});return;}

        var sqlArr=[],sqlFunArr=[],sqlStr="";
        sqlStr = "DELETE FROM plat_role_permission where rid="+roleId;
        sqlArr.push(sqlStr);

        var sqlCol="rid,pid";
        var sqlVal="";
        pData.pid.split(",").forEach(function(v,i){
            sqlVal+="("+roleId+","+v+"),"
        });
        sqlVal=sqlVal.substr(0,sqlVal.length-1);
        sqlStr="INSERT INTO plat_role_permission ("+sqlCol+") VALUES "+sqlVal;
        sqlArr.push(sqlStr);

        sqlArr.forEach(function(item,index){
            var sqlFunc=function (callback) {
                useDao.sql(item, function (err, result) {
                    callback(null, result);
                });
            }
            sqlFunArr.push(sqlFunc);
        });

        async.series(sqlFunArr, function (err, result) {
            res.json({result: err?"err":"ok"});
        });

    },sys_roleList: function (req, res, next) {//公司管理
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        }
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj=sysUtil.pageFunc({"curPage":curPage,"search":search});
        var searchObj=sysUtil.searchFunc(search,{});

        var sqlStr="SELECT * FROM plat_role where companyId="+company_id+" and "+searchObj.searchFilter+pageObj.sqlLimit;
        var sqlPage="SELECT count(*) as count FROM plat_role where companyId="+company_id+" and "+searchObj.searchFilter;

        async.parallel({
                listData: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                },page: pageObj.sqlFunc(sqlPage)
            }
            , function (err, result) {
                sysUtil.resRender(req,res,viewsPath+'/sys_roleList',{
                    listData:result.listData,
                    pageInfo:result.page.pageInfo
                });
            });
    },checkDelRole: function(req, res, next) {
        var pData=req.body.postData;
        var vid=pData.id;
        var sql="select count(*) as count from plat_user where find_in_set('"+vid+"',roleIds)";
        useDao.sql(sql, function (err, result) {
            var str="ok";
            if(result[0].count>0){str="no";}
            res.json({result:str});
        });
    },delRole: function (req, res, next) {//:删除角色
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
    },sys_roleEdit: function (req, res, next) {//：保存编辑角色信息
        var pData=req.body.postData;
        var dataId=pData.id;
        var sqlCol="roleName='"+pData.roleName+"'";
        useDao.updateById("plat_role",dataId,sqlCol, function (err,result) {
            res.json({result:'ok'});
        });
    },sys_roleAdd: function (req, res, next) {//：保存角色信息
        var company_id=req.session.companyId;
        var pData=req.body.postData;
        var sqlCol=" roleName,companyId,type";
        var sqlVal="'"+pData.roleName+"','"+company_id+"','pt'";
        useDao.insert("plat_role",sqlCol,sqlVal, function (err,result) {
            res.json({result:'ok'});
        });
    },sys_userFrame: function (req, res, next) {//用户管理
        res.render(viewsPath+'/sys_userFrame');
    },tree_sys_user: function (req, res, next) {//用户树
        var company_id=req.session.companyId;
        var sqlStr="SELECT * FROM plat_department where companyId="+company_id+" or id=1";

        async.parallel({
                data: function (callback) {
                    useDao.sql(sqlStr, function (err, result) {
                        callback(null, result);
                    });
                }
            }
            , function (err, result) {
                var treeData=util.toTree(result.data);
                res.render('template/tree_sys_user', {
                    treeData:treeData
                });
            });
    },sys_userList: function (req, res, next) {//用户管理
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
            "LEFT JOIN plat_company pc ON pu.companyId=pc.id WHERE  pu.companyId="+company_id+" and pu.deptId="+deptId+" and "+searchObj.searchFilter+pageObj.sqlLimit;
        var sqlRole="SELECT * FROM plat_role where companyId="+company_id;
        var sqlPage="SELECT count(*) as count FROM plat_user where companyId="+company_id+" and deptId="+deptId+" and "+searchObj.searchFilter;
        var sqlDept="SELECT c.compName,d.deptName,d.id,d.parentId FROM plat_company c LEFT JOIN plat_department d on d.companyId=c.id WHERE c.id="+company_id;

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
                sysUtil.resRender(req,res,viewsPath+'/sys_userList',{
                    listData:result.listData,
                    roleData:result.roleData,
                    deptData:result.deptData,
                    deptId:deptId,
                    pageInfo:result.page.pageInfo
                });
            });

    },sys_userAdd: function (req, res, next) {//：添加用户信息
        var company_id=req.session.companyId;
        var pData=req.body.postData;
        var sqlCol=" userName,loginName,passWord,createTime,tel,sex,isUse,deptId,companyId,roleIds,roleNames";
        var passWord=util.md5(pData.loginName + '#' + pData.loginName+"123456");//初始化密码
        var sqlVal="'"+pData.userName+"','"+pData.loginName+"','"+passWord+"','"+util.getNowFormatDate()+"','"
            +pData.tel+"','"+pData.sex+"','"+pData.isUse+"','"+pData.deptId+"','"+company_id+"','"+pData.roleIds+"','"+pData.roleNames+"'";

        useDao.insert("plat_user",sqlCol,sqlVal, function (err,result) {
            res.json({result:'ok'});
        });
    },sys_userEdit: function (req, res, next) {//：保存编辑用户信息
        var pData=req.body.postData;
        var dataId=pData.id;
        var sqlCol="userName='"+pData.userName+"',loginName='"+pData.loginName+"',tel='"+pData.tel+"',sex='"+pData.sex+
            "',isUse='"+pData.isUse+"',deptId='"+pData.deptId+"',roleIds='"+pData.roleIds+"',roleNames='"+pData.roleNames+"'";

        useDao.updateById("plat_user",dataId,sqlCol, function (err,result) {
            res.json({result:'ok'});
        });

    },sys_userDel: function (req, res, next) {//:删除用户
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
    },sys_userRetPwd: function (req, res, next) {//：初始化用户密码

        var pData=req.body.postData;
        var vid=pData.id;
        var passWord=util.md5(pData.loginName + '#' + pData.loginName+"123456");//初始化密码
        var sqlCol="passWord='"+passWord+"'";

        useDao.updateById("plat_user",vid,sqlCol, function (err,result) {
            if (result.affectedRows==1){
                res.json({result:'ok'});
            }else{
                res.json({result:'err'});
            }
        });

    },sys_passSetting: function (req, res, next) {//:密码修改
        var companyId=req.session.companyId;
        if(util.isEmpty(companyId)){
            res.render('noAuth');
            return;
        }
        var opType=req.query.opType;
        if (opType=="update"){
            var pData=req.body.postData;
            var userId=req.session.userId;

            var loginName = req.session.loginName;
            var oldPwd= util.md5(loginName + '#' + pData.oldPwd);
            var newPwd= util.md5(loginName + '#' + pData.newPwd1);

            var sqlCol="UPDATE plat_user SET passWord = '"+newPwd+"' WHERE id = "+userId+" AND passWord='"+oldPwd+"' AND companyId="+companyId;

            useDao.sql(sqlCol, function (err, result) {
                if (result.affectedRows==1){
                    res.json({result:'ok'});
                }else{
                    res.json({result:'err'});
                }
            });
        }else{
            res.render(viewsPath+'/sys_passSetting');
        }
    }

};

"use strict";
var pub = require('../public');
var useDao = pub.pack.useDao,
    util =pub.pack.util,
    async =pub.pack.async,
    settings =pub.pack.settings,
    logger = pub.pack.logger,
    multer= pub.pack.multer,
    uuidv1= pub.pack.uuidv1;
var sysUtil = rootReq('model/sysUtil/m_sys_pub');
var viewsPath="biz";//渲染views文件路径

module.exports = {
    relicArea: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj = sysUtil.pageFunc({ "curPage": curPage, "search": search, "pageSize": 12});
        var searchObj = sysUtil.searchFunc(search, { "area_name": "ba.area_name"});
        var sqlPage = "SELECT count(*) as count FROM biz_area ba where " + searchObj.searchFilter;//分页sql

        var sqlStr = "SELECT ba.*,COUNT(br.id) AS num FROM `biz_area` ba  LEFT JOIN biz_region br ON ba.id=br.areaId WHERE ba.company_id=" + company_id + " AND " + searchObj.searchFilter + " GROUP BY ba.id " + pageObj.sqlLimit;
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
            , page: pageObj.sqlFunc(sqlPage)            
        }, function (err, result) {
            if(req.query.type){
                res.status(200).send({
                    tempData: result.usersData,
                    pageInfo: result.page.pageInfo
                })
            }else{
                res.render(viewsPath+'/relicArea', {
                    tempData: result.usersData,
                    pageInfo: result.page.pageInfo
                });
            }

        });
    },
    relicAreaAdd: function (req, res, next) {
        res.render(viewsPath+"/relicAreaAdd")
    },
    addAreaSave: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        var sqlStr = "INSERT INTO biz_area (`area_name`, `area_position`, `remark`, `attach`, `company_id`) VALUES ( '" + postData.area_name + "', '" + postData.area_position + "', '" + postData.remark + "', '" + postData.attach + "','" + company_id + "')";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            res.send({status: 200, message: "添加成功"})
        });
    },
    relicAreaEdit: function (req, res, next) {
        var id = req.query.id;
        async.parallel({
            usersData: function (callback) {
                useDao.queryById("biz_Area", id, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (err) {
                res.render(viewsPath+"/error");
            } else {
                res.render(viewsPath+"/relicAreaEdit", {tempData: result.usersData})
            }

        });
    },
    relicAreaEditSave: function (req, res, next) {
        var postData = req.body;
        var company_id = req.session.companyId;
        postData.area_position = JSON.stringify(postData.area_position);
        var sqlStr = "UPDATE biz_area SET  area_name='" + postData.area_name + "', area_position='" + postData.area_position + "', remark='" + postData.remark + "', attach='" + postData.attach + "', company_id='" + company_id + "' WHERE (id='" + postData.id + "')";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (result.usersData.affectedRows) {
                res.send({status: 200, message: "保存成功"})
            } else {
                res.json({status: 500, message: "保存出错"});
            }

        });
    },
    areaUpload:function (req,res,next) {
        res.send({status: 200,file:req.file})
    },
    listDel: function (req, res, next) {
        var id = req.body.id;
        async.parallel({
            usersData: function (callback) {
                useDao.deleteById("biz_area", id, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            res.send({status: 200, message: "删除成功"})
        });
    },
    relicMan: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj = sysUtil.pageFunc({ "curPage": curPage, "search": search, "pageSize": 5});
        var searchObj = sysUtil.searchFunc(search, { "name": "br.name"});
        var sqlPage = "SELECT count(*) as count FROM biz_region br where company_id=" + company_id +" AND "+ searchObj.searchFilter;//分页sql

        var sqlStr = "SELECT * FROM(SELECT br.*,ba.area_name FROM biz_region br JOIN ( SELECT SUBSTRING_INDEX( group_concat(id ORDER BY id DESC), ',', 1 ) AS id FROM biz_region GROUP BY groupId ) ma ON br.id = ma.id LEFT JOIN biz_area ba ON br.areaId = ba.id WHERE br.company_id = " + company_id + " AND " + searchObj.searchFilter + pageObj.sqlLimit +") cc "+" ORDER BY cc.createTime DESC ";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {callback(null, result)})},
                page: pageObj.sqlFunc(sqlPage)
            },function (err, result) {
                if(req.query.type){
                    res.status(200).send({
                        tempData: result.usersData,
                        pageInfo: result.page.pageInfo
                    })
                }else{
                    res.render(viewsPath+'/relicMan', {
                        tempData: result.usersData,
                        pageInfo: result.page.pageInfo
                    });
                }
        });
    },
    relicHistory: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var curPage = req.query.curPage;//获取当前页码
        var search=req.query.search;
        var pageObj = sysUtil.pageFunc({ "curPage": curPage, "search": search, "pageSize": 5});
        var searchObj = sysUtil.searchFunc(search, { "name": "br.name"});
        var sqlPage = "SELECT count(*) as count FROM biz_region br where br.company_id=" + company_id +" AND br.version is NOT NULL AND "+searchObj.searchFilter;//分页sql

        var sqlStr = "SELECT br.*, ba.area_name FROM biz_region br LEFT JOIN biz_area ba ON br.areaId = ba.id WHERE br.company_id = " + company_id + " AND br.version is NOT NULL AND " + searchObj.searchFilter + " ORDER BY createTime DESC" + pageObj.sqlLimit;
    async.parallel({
        usersData: function (callback) {
            useDao.sql(sqlStr, function (err, result) { callback(null, result)})},
            page: pageObj.sqlFunc(sqlPage)
    }, function (err, result) {
        if(req.query.type){
            res.status(200).send({
                tempData: result.usersData,
                pageInfo: result.page.pageInfo
            })
        }else{
            res.render(viewsPath +'/relicHistory', {
                tempData: result.usersData,
                pageInfo: result.page.pageInfo
            });
        }
    });
},
    relicManAdd: function (req, res, next) {
        res.render(viewsPath+"/relicManAdd")
    },
    getRelicArea: function (req, res, next) {
        async.parallel({
            usersData: function (callback) {
                useDao.queryBy("biz_area", "id is not null", function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            res.send(result.usersData);
        });
    },
    relicManAddSave: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        var createTime =util.getMyTime("yyyy-MM-dd hh:mm:ss");
        var sqlStr = "INSERT INTO biz_region (`name`, `address`, `lat`, `lng`, `altitude`, `reHeight`, `category`, `acreage`, `age`, `areaId`, `towns`, `content`,`createTime`, `company_id`, `groupId`,`attach`) VALUES ( '" + postData.name + "', '" + postData.address + "', '" + postData.lat + "', '" + postData.lng + "','" + postData.altitude + "', '" + postData.reHeight + "', '" + postData.category + "', '" + postData.acreage + "', '" + postData.age + "', '" + postData.areaId + "','" + postData.towns + "', '" + postData.content + "', '" + createTime + "', '" + company_id + "','"+uuidv1()+"','"+postData.attach+"')";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (err) {
                res.json({status: 500, message: "添加出错"});
            } else {
                res.send({status: 200, message: "添加成功"})
            }

        });
    },

    relicManDel: function (req, res, next) {
        var id = req.body.id;
        async.parallel({
            usersData: function (callback) {
                useDao.deleteById("biz_region", id, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (err) {
                res.json({status: 500, message: "删除出错"});
            } else {
                res.send({status: 200, message: "删除成功"})
            }

        });
    },
    relicManEdit: function (req, res, next) {
        var id = req.query.id,type=req.query.type;
        async.parallel({
            usersData: function (callback) {
                useDao.queryById("biz_region", id, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (err) {
                res.render(viewsPath+"/error");
            } else {
                var tempData=result.usersData;
                    tempData.type=0;
                if(type==1){
                    //更新
                    tempData.type=1
                }
                res.render(viewsPath+"/relicManEdit", {tempData:tempData })
            }

        });
    },

    relicManEditSave: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        postData.lat=JSON.stringify(postData.lat);
        postData.lng=JSON.stringify(postData.lng);
        var sqlStr = "UPDATE biz_region SET name='" + postData.name + "',address='" + postData.address + "',lat='" + postData.lat + "',lng='" + postData.lng + "' ,altitude='" + postData.altitude + "',reHeight='" + postData.reHeight + "',category='" + postData.category + "',acreage='" + postData.acreage + "',age='" + postData.age + "',areaId='" + postData.areaId + "',towns='" + postData.towns + "',content='" + postData.content + "',attach='" + postData.attach + "' WHERE id='" + postData.id + "' and company_id='" + company_id + "'";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (result.usersData.affectedRows) {
                res.send({status: 200, message: "保存成功"})
            } else {
                res.json({status: 500, message: "保存出错"});
            }

        });
    },
    relicManEditUpdate: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        postData.lat=JSON.stringify(postData.lat);
        postData.lng=JSON.stringify(postData.lng);
        var version=util.buildVersion();
        var createTime =util.getMyTime("yyyy-MM-dd hh:mm:ss");
        var sqlStr = "UPDATE biz_region SET name='" + postData.name + "',address='" + postData.address + "',lat='" + postData.lat + "',lng='" + postData.lng + "' ,altitude='" + postData.altitude + "',reHeight='" + postData.reHeight + "',category='" + postData.category + "',acreage='" + postData.acreage + "',age='" + postData.age + "',areaId='" + postData.areaId + "',towns='" + postData.towns + "',content='" + postData.content + "',version='" + version + "',createTime='" + createTime + "',attach='" + postData.attach + "' WHERE id='" + postData.id + "' and company_id='" + company_id + "'";
        async.parallel({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (result.usersData.affectedRows) {
                res.send({status: 200, message: "更新成功"})
            } else {
                res.json({status: 500, message: "更新出错"});
            }

        });
    },

    relicManverify: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        var approId = req.session.userId;
        var approName = req.session.userName;

        var version = util.buildVersion();

        var sqlStr = "UPDATE biz_region SET approId='" + approId + "', approName='" + approName + "',version='" + version + "'" + "WHERE id='" + postData.id + "' and company_id='" + company_id + "'";
        var sqlStrS = "SELECT br.*,ba.area_name FROM biz_region br JOIN ( SELECT SUBSTRING_INDEX( group_concat(id ORDER BY id DESC), ',', 1 ) AS id FROM biz_region GROUP BY groupId ) ma ON br.id = ma.id LEFT JOIN biz_area ba ON br.areaId = ba.id WHERE br.company_id = " + company_id+" ORDER BY createTime DESC ";
        async.series({
            usersData: function (callback) {
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }, selectData: function (callback) {
                useDao.sql(sqlStrS, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {

            if (result.usersData.affectedRows) {
                res.send({status: 200, message: "审核成功", tempData: result.selectData})
            } else {
                res.json({status: 500, message: "审核出错"});
            }


        });
    },
    relicManView: function (req, res, next) {
        var id = req.query.id;
        async.parallel({
            usersData: function (callback) {
                useDao.queryById("biz_region", id, function (err, result) {
                    callback(null, result);
                });
            },
            verifyData: function (callback) {
                var sqlStr = "SELECT * FROM biz_survey WHERE region_id=" + id;
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (err) {
                res.render(viewsPath+"/error");
            } else {
                res.render(viewsPath+"/relicManView", {tempData: result.usersData, verifyData: result.verifyData})
            }

        });
    },
    relicManSearch: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
        var postData = req.body;
        async.parallel({
            usersData: function (callback) {
                var sqlStr = "SELECT br.*,ba.area_name FROM biz_region br LEFT JOIN biz_area ba ON br.areaId=ba.id WHERE br.`name` LIKE '%" + postData.name + "%' AND br.company_id=" + company_id;
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            res.send({status: 200, tempData: result.usersData});
        });
    },
    download: function (req, res, next) {
        var file=req.query.file;
        res.download("public/upload_file/"+file);
},
    relicHisSearch: function (req, res, next) {
        var company_id=req.session.companyId;
        if(util.isEmpty(company_id)){
            res.render('noAuth');
            return;
        };
    var postData = req.body;
    async.parallel({
        usersData: function (callback) {
            var sqlStr = "SELECT br.*,ba.area_name FROM biz_region br LEFT JOIN biz_area ba ON br.areaId=ba.id WHERE br.`name` LIKE '%" + postData.name + "%' AND br.version is not NULL AND br.company_id=" + company_id;
            useDao.sql(sqlStr, function (err, result) {
                callback(null, result);
            });
        }
    }, function (err, result) {
        res.send({status: 200, tempData: result.usersData});
    });
},
    relicSurvey: function (req, res, next) {
        var postData = req.body;
        async.parallel({
            usersData: function (callback) {
                var sqlStr = "SELECT * FROM `biz_survey` WHERE region_id=" + postData.id;
                useDao.sql(sqlStr, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            res.send({status: 200, tempData: result.usersData});
        });
    },
    relicSurveyDel: function (req, res, next) {
        var id = req.body.id;
        async.parallel({
            usersData: function (callback) {
                useDao.deleteById("biz_survey", id, function (err, result) {
                    callback(null, result);
                });
            }
        }, function (err, result) {
            if (result.usersData.affectedRows) {
                res.send({status: 200, message: "删除成功"})
            } else {
                res.json({status: 500, message: "删除出错"});
            }

        });
    },
    relicSurveyAddSave: function (req, res, next) {
    var postData = req.body;
    var createTime =util.getMyTime("yyyy-MM-dd hh:mm:ss");
        var survey_make_id = req.session.userId;
        var survey_make_name = req.session.userName;

    var survey_image="test"

    var sqlStr = "INSERT INTO biz_survey (`survey_name`, `region_id`, `region_name`, `survey_info`, `survey_time`, `survey_make_id`, `survey_make_name`, `survey_image`, `region_version`, `survey_status`) VALUES ( '" + postData.survey_name + "', '" + postData.region_id + "', '" + postData.region_name + "', '" + postData.survey_info + "','" + createTime + "', '" + survey_make_id + "', '" + survey_make_name + "', '" + survey_image + "', '" + postData.region_version + "', '" + postData.survey_status+ "')";
    async.parallel({
        usersData: function (callback) {
            useDao.sql(sqlStr, function (err, result) {
                callback(null, result);
            });
        }
    }, function (err, result) {
        if (result.usersData.affectedRows) {
            res.send({status: 200, message: "添加成功"})
        } else {
            res.json({status: 500, message: "添加出错"});
        }

    });
},
    relicSurveyComp: function (req, res, next) {
    var postData = req.body;
    async.parallel({
        usersData: function (callback) {
            var sqlStr = "UPDATE biz_survey SET  survey_status=1 WHERE (id='" + postData.id + "')";
            useDao.sql(sqlStr, function (err, result) {
                callback(null, result);
            });
        }
    }, function (err, result) {
        res.send({status: 200, message:"已完成"});
    });
},
    historyMap: function (req, res, next) {
        res.render(viewsPath + '/historyMap')
    }
};
3
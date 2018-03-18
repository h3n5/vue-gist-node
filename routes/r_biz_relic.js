"use strict";
var express = require('express');
var router = express.Router();
var multer = require("multer");
var util = require('../util/util');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload_file')
    },
    filename: function (req, file, cb) {
        var file=file.originalname.split(".");
        cb(null, file[0] + '-' + util.getMyTime("yyyyMMddhhmmssS") +'.'+file[1])
    }
});
var upload = multer({ storage: storage }).single('file');

var relic = require('../model/biz/m_relic');
/*********************router配置 开始******************/
//遗址区域
router.all('/relicArea', relic.relicArea);
router.all('/relicAreaAdd', relic.relicAreaAdd);
router.all('/listDel', relic.listDel);
router.all('/addAreaSave', relic.addAreaSave);
router.all('/relicAreaEdit', relic.relicAreaEdit);
router.all('/relicAreaEditSave', relic.relicAreaEditSave);

router.all('/areaUpload',upload,relic.areaUpload);

//遗址管理
router.all('/relicMan', relic.relicMan);
router.all('/relicManAdd', relic.relicManAdd);
router.all('/relicManAddSave', relic.relicManAddSave);
router.all('/relicManDel', relic.relicManDel);
router.all('/relicManEdit', relic.relicManEdit);
router.all('/relicManEditSave', relic.relicManEditSave);
router.all('/relicManEditUpdate', relic.relicManEditUpdate);
router.all('/relicManverify', relic.relicManverify);
router.all('/relicManView', relic.relicManView);
router.all('/relicManSearch', relic.relicManSearch);
router.all('/download', relic.download);

//遗址历史
router.all('/relicHistory', relic.relicHistory);
router.all('/relicHisSearch', relic.relicHisSearch);
//遗迹勘察
router.all('/relicSurvey', relic.relicSurvey);
router.all('/relicSurveyDel', relic.relicSurveyDel);
router.all('/relicSurveyAddSave', relic.relicSurveyAddSave);
router.all('/relicSurveyComp', relic.relicSurveyComp);
//加载弹出
router.all('/getRelicArea', relic.getRelicArea);
//历史影像
router.all('/historyMap', relic.historyMap);
module.exports = router;

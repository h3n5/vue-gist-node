"use strict";
var express = require('express');
var router = express.Router();

var sysPub = require('../model/sysUtil/m_sys_pub');
var login = require('../model/system/sys/m_login');
var platSetting = require('../model/system/plat/m_platSetting');
var sysSetting = require('../model/system/sys/m_sysSetting');

/*********************router配置 开始******************/
router.get('/', login.login);//登录
router.get('/login', login.login);//登录
router.all('/loginCheck', login.loginCheck);//登录检查
router.all('/logout', login.logout);//退出
router.all('/index',sysPub.auth_check, login.index);//首页
//-------------系统---------------
router.all('/sys_setting',sysSetting.sys_setting);
router.all('/sys_passSetting',sysPub.auth_check, sysSetting.sys_passSetting);//密码修改
//分公司
router.all('/sys_compFrame',sysPub.auth_check,sysSetting.sys_compFrame);
router.all('/tree_sys_comp',sysPub.auth_check,sysSetting.tree_sys_comp);
router.all('/sys_compEdit',sysPub.auth_check,sysSetting.sys_compEdit);
//部门
router.all('/sys_deptFrame',sysPub.auth_check,sysSetting.sys_deptFrame);
router.all('/tree_sys_dept',sysPub.auth_check,sysSetting.tree_sys_dept);
router.all('/sys_deptEdit',sysPub.auth_check,sysSetting.sys_deptEdit);
router.all('/sys_deptEditSave',sysPub.auth_check,sysSetting.sys_deptEditSave);
router.all('/sys_deptAdd',sysPub.auth_check,sysSetting.sys_deptAdd);
router.all('/checkDelDept',sysPub.auth_check,sysSetting.checkDelDept);
router.all('/delDeptDept',sysPub.auth_check,sysSetting.delDeptDept);
//角色/权限
router.all('/sys_rolePermList',sysPub.auth_check,sysSetting.sys_rolePermList);
router.all('/rolePermDel',sysPub.auth_check,sysSetting.rolePermDel);
router.all('/rolePermSave',sysPub.auth_check,sysSetting.rolePermSave);
//角色
router.all('/sys_roleList',sysPub.auth_check,sysSetting.sys_roleList);
router.all('/checkDelRole',sysPub.auth_check,sysSetting.checkDelRole);
router.all('/sys_roleAdd',sysPub.auth_check,sysSetting.sys_roleAdd);
router.all('/sys_roleEdit',sysPub.auth_check,sysSetting.sys_roleEdit);
router.all('/delRole',sysPub.auth_check,sysSetting.delRole);
//用户
router.all('/sys_userFrame',sysPub.auth_check,sysSetting.sys_userFrame);
router.all('/sys_userList',sysPub.auth_check,sysSetting.sys_userList);
router.all('/tree_sys_user',sysPub.auth_check,sysSetting.tree_sys_user);
router.all('/sys_userAdd',sysPub.auth_check,sysSetting.sys_userAdd);
router.all('/sys_userEdit',sysPub.auth_check,sysSetting.sys_userEdit);
router.all('/sys_userDel',sysPub.auth_check,sysSetting.sys_userDel);
router.all('/sys_userRetPwd',sysPub.auth_check,sysSetting.sys_userRetPwd);


//-------------平台---------------
router.all('/plat_setting',platSetting.plat_setting);
//公司
router.get('/plat_compList',platSetting.plat_compList);
router.all('/plat_compAdd',sysPub.auth_check,platSetting.plat_compAdd);
router.all('/plat_compEdit',sysPub.auth_check,platSetting.plat_compEdit);
//权限
router.all('/plat_permList',sysPub.auth_check,platSetting.plat_permList);
router.all('/plat_permAdd',sysPub.auth_check,platSetting.plat_permAdd);
router.all('/plat_permEdit',sysPub.auth_check,platSetting.plat_permEdit);
router.all('/plat_permDel',sysPub.auth_check,platSetting.plat_permDel);
//角色
router.all('/plat_roleList',sysPub.auth_check,platSetting.plat_roleList);
router.all('/plat_roleAdd',sysPub.auth_check,platSetting.plat_roleAdd);
router.all('/plat_roleEdit',sysPub.auth_check,platSetting.plat_roleEdit);
router.all('/plat_roleDel',sysPub.auth_check,platSetting.plat_RoleDel);
//角色/权限
router.all('/plat_rolePermList',sysPub.auth_check,platSetting.plat_rolePermList);
//用户
router.all('/plat_userFrame',sysPub.auth_check,platSetting.plat_userFrame);
router.all('/plat_userList',sysPub.auth_check,platSetting.plat_userList);
router.all('/tree_plat_user',sysPub.auth_check,platSetting.tree_plat_user);
router.all('/plat_userAdd',sysPub.auth_check,platSetting.plat_userAdd);
router.all('/plat_userEdit',sysPub.auth_check,platSetting.plat_userEdit);
router.all('/plat_userDel',sysPub.auth_check,platSetting.plat_userDel);

module.exports = router;

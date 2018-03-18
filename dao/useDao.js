"use strict";
var mysql=require('mysql');
var $conf=require('../conf/db');
var $util=require('../util/util');
var $sql=require('./useSqlMapping');
var logger = require('../logs/logger_hz.js');
//使用连接池，提升性能
var pool=mysql.createPool($util.extend({},$conf.mysql));
module.exports={
	checkWhere:function(sqlStr){//检查update或delete是否包含where子句
		sqlStr=sqlStr.toUpperCase();
		if(sqlStr.indexOf("UPDATE")>-1||sqlStr.indexOf("DELETE")>-1){
			if(sqlStr.indexOf("WHERE")>-1){return true;}else{return false;}
		}else{return true;}
	},
	sql:function(sql,callback){
		if(!module.exports.checkWhere(sql)){logger.error("update/delete缺失where子句",sql);callback(null,{});return false;}
		pool.getConnection(function(err,connection){
			if(err){console.log("sql Connection Err:",err);}else{console.log("sql=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("sql Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},
	insert:function(tabelName,columns,val,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.insert(tabelName,columns,val);
			if(err){console.log("insert Connection Err:",err);}else{console.log("insert=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("insert Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},
	deleteById:function(tabelName,id,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.deleteById(tabelName,id);
			if(err){console.log("deleteById Connection Err:",err);}else{console.log("deleteById=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("deleteById Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},deleteBy:function(tabelName,csql,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.deleteBy(tabelName,csql);
			if(err){console.log("deleteBy Connection Err:",err);}else{console.log("deleteBy=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("deleteBy Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},
	updateById:function(tabelName,id,columns,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.updateById(tabelName,id,columns);
			if(err){console.log("updateById Connection Err:",err);}else{console.log("updateById=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("updateById Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},updateBy:function(tabelName,where,columns,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.updateBy(tabelName,where,columns);
			if(err){console.log("updateBy Connection Err:",err);}else{console.log("updateBy=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("updateBy Err:",err);}
				connection.release();
				callback(null,result);
			});
		});
	},queryById:function(tabelName,id,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.queryById(tabelName,id);
			if(err){console.log("queryById Connection Err:",err);}else{console.log("queryById=",sql);}
			connection.query(sql,function(err,result){
				if(err){console.log("queryById Err:",err);}
				connection.release();
				callback(null,result);
			});
		});

	},
	queryBy:function(tabelName,filters,callback){
		pool.getConnection(function(err,connection){
			var sql=$sql.queryBy(tabelName,filters);
			console.log("queryBy=",sql);
			connection.query(sql,function(err,result){
				connection.release();
				callback(null,result);
			});
		});

	},queryBySome:function(tabelName,columns,filters,sqlParams,order,offset,limit,callback){
		pool.getConnection(function (err,connection){
			var sql=$sql.queryBySome(tabelName,columns,filters,order,offset,limit);
			console.log("queryBySome=",sql);
			connection.query(sql,sqlParams,function (err,result) {
				connection.release();
				callback(null,result);
			});
		});
	}
};
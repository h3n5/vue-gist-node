"use strict";
var user={
	insert:function(tableName,columns,val){
		return "insert into "+tableName+"("+columns+") values("+val+")";
	},deleteById:function(tableName,id){
		return "delete from "+ tableName+ " where id="+id;
	},
	deleteBy:function(tableName,sql){
		return "delete from "+ tableName+ " where "+sql;
	},
	updateById:function(tableName,id,columns){
		return "update "+tableName+" set "+columns+" where id="+id;
	},updateBy:function(tableName,where,columns){
		return "update "+tableName+" set "+columns+" where "+where;
	},queryById: function (tableName,id) {
		return "select * from "+tableName+" where id="+id;
	},
	queryBy: function (tableName,filters) {
		return "select * from "+tableName+" where "+filters;
	},
	queryBySome: function (tableName,columns,filters,order,offset,limit) {
		if(tableName===null){
			return false;
		}
		if(columns===null){
			columns="*";
		}
		if(filters===null){
			filters="";
		}else{
			filters=" where "+filters;
		}
		if(order===null){
			order = "";
		}else{
			order = " ORDER BY "+order;
		}
		if(offset===null){
			offset = "";
		}else{
			offset=" OFFSET "+offset;
		}
		if(limit===null){
			limit = "";
		}else{
			limit=" LIMIT "+limit;
		}
		return "select "+columns+" from "+tableName+filters+order+limit+offset;
	}
};

module.exports=user;
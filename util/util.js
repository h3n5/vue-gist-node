var crypto = require('crypto');
module.exports={

extend:function(target,source,flag){
	for(var key in source){
		if(source.hasOwnProperty(key))
 			flag ?
  				(target[key]=source[key]):
  				(target[key] === void 0 &&(target[key]=source[key]));

	}
	return target;
},
isEmpty:function(str) {//判断为空方法
		if (str == null || str == undefined || str == '') {
			return true;
		}
		return false;
},filterEmpty:function(str) {//为空则返回空串
        if (str == null || str == undefined || str == '') {
            return str;
        }
        return "";
},
	getNowFormatDate:function () {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();

		var hours=date.getHours();
		var minute=date.getMinutes();
		var seconds=date.getSeconds();

		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		if (hours <= 9) {
			hours = "0" + hours;
		}
		if (minute <= 9) {
			minute = "0" + minute;
		}
		if (seconds <= 9) {
			seconds = "0" + seconds;
		}


		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+ " " + hours + seperator2 + minute
			+ seperator2 + seconds;

		return currentdate;
	},GetDateDiff:function (startTime, endTime, diffType) {
	//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
	startTime = startTime.replace(/\-/g, "/");
	endTime = endTime.replace(/\-/g, "/");
	//将计算间隔类性字符转换为小写
	diffType = diffType.toLowerCase();
	var sTime =new Date(startTime); //开始时间
	var eTime =new Date(endTime); //结束时间
	//作为除数的数字
	var timeType =1;
	switch (diffType) {
		case"second":
			timeType =1000;
			break;
		case"minute":
			timeType =1000*60;
			break;
		case"hour":
			timeType =1000*3600;
			break;
		case"day":
			timeType =1000*3600*24;
			break;
		default:
			break;
	}
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
},
	getNowFormatDate2: function () {
		var date = new Date();
		var seperator1 = "";
		var seperator2 = "";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();

		var hours = date.getHours();
		var minute = date.getMinutes();
		var seconds = date.getSeconds();

		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		if (hours <= 9) {
			hours = "0" + hours;
		}
		if (minute <= 9) {
			minute = "0" + minute;
		}
		if (seconds <= 9) {
			seconds = "0" + seconds;
		}


		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
			+hours + seperator2 + minute
			+ seperator2 + seconds;

		return currentdate;
	}, 
getMyTime:function(fmt){
		var date = new Date();
		var o = {
			"M+" : date.getMonth()+1,                 //月份
			"d+" : date.getDate(),                    //日
			"h+" : date.getHours(),                   //小时
			"m+" : date.getMinutes(),                 //分
			"s+" : date.getSeconds(),                 //秒
			"q+" : Math.floor((date.getMonth()+3)/3), //季度
			"S"  : date.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt))
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("("+ k +")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
		//使用方法如下：
		//var time1 = new Date().format("yyyy-MM-dd HH:mm:ss");
		//var time2 = new Date().format("yyyy-MM-dd");
	},md5:function md5(str) {//md5
		var md5sum = crypto.createHash('md5');
		md5sum.update(str);
		str = md5sum.digest('hex');
		return str;
	},
	/**
	 * 加密函数
	 * @param str 源串
	 * @param secret  因子
	 * @returns str
	 */
	encrypt:function encrypt(str, secret) {
		var cipher = crypto.createCipher('aes192', secret);
		var enc = cipher.update(str, 'utf8', 'hex');
		enc += cipher.final('hex');
		return enc;
	},

	/**
	 * 解密
	 * @param str
	 * @param secret
	 * @returns str
	 */
	decrypt:function decrypt(str, secret) {
		var decipher = crypto.createDecipher('aes192', secret);
		var dec = decipher.update(str, 'hex', 'utf8');
		dec += decipher.final('utf8');
		return dec;
	},toTree:function toTree(data) {//遍历转化成树
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        delete item.children;
    });
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
        map[item.id] = item;
    });
    var val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.parentId];
        // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
},
    randomString: function (len) { //产生数字加字母的随机数
        len = len || 32;
        var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            //0~32的整数
            pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
        }
        return pwd;
    },
    buildVersion: function () {
		return this.getNowFormatDate2()+this.randomString(3);
    },
}
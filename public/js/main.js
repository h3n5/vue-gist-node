//检查是否为空
function isEmpty(str) {
	str =str;
	if (str == null || str == undefined || str == '') {
		return true;
	}
	return false;
}
//检查是否为空
function hasLength($obj) {
	if ($obj.length>0) {
		return true;
	}
	return false;
}
function transEmpty(str) {//为空则返回空串
    if (str == null || str == undefined || str == '') {
        return "";
    }
    return str;
}
//获取当前时间
function getNowFormatDate(){
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

}

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	//s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}


function GetDateDiff(startTime, endTime, diffType) {
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
}

function touchPicture(id){

	touch.on('#' + id, 'touchstart', function(ev) {
		ev.preventDefault();
	});
	// 初如化变量
	var dx = 0, dy = 0, offx = 0, offy = 0;
	var initialScale = 1;
	var currentScale = 1;

	touch.on('#' + id, 'drag', function(ev) { // 拖动
		dx = dx || 0;
		dy = dy || 0;
		offx = dx + ev.x + "px";
		offy = dy + ev.y + "px";

		this.style.webkitTransform = "scale(" + currentScale + ") translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on('#' + id, 'dragend', function(ev) {
		dx += ev.x;
		dy += ev.y;
	});

	touch.on('#' + id, 'pinch', function(ev) {// 缩放
		ev.hasStopedPropagation = true;
		currentScale = ev.scale - 1;
		currentScale = initialScale + currentScale;
		currentScale = currentScale < 0.5 ? 0.5 : currentScale;
		this.style.webkitTransform = "scale(" + currentScale + ") translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on('#' + id, 'pinchend', function(ev) {
		initialScale = currentScale;
	});

	touch.on('#' + id, 'doubletap', function(ev) {// 双击屏幕
		dx = 0, dy = 0, offx = 0, offy = 0;
		if (currentScale == 1) {
			initialScale = currentScale = 2;// 放大两倍
		} else {
			initialScale = currentScale = 1;// 原始
		}
		this.style.webkitTransform = "scale(" + currentScale + ")";
	});
}
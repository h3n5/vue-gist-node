var db = {};
var redis = require("redis");
var RDS_PORT = 6379,
    RDS_HOST = '127.0.0.1',
    RDS_PWD = "",
    RDS_OPTS = {auth_pass: RDS_PWD},
    client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
/*client.on("error", function (err) {
    console.log("Error :" , "Redis连接失败.请检查服务是否启动.");
});
client.on('connect', function(){
    console.log('Redis连接成功.');
});*/
/**
 * 添加string类型的数据
 * @param key 键
 * @params value 值
 * @params expire (过期时间,单位秒;可为空，为空表示不过期)
 * @param callBack(err,result)
 */
db.set = function(key, value, expire, callback){
    client.set(key, value, function(err, result){
        if (err) {
            console.log(err);
            callback(err,null);
            return;
        }
        if (!isNaN(expire) && expire > 0) {
            client.expire(key, parseInt(expire));
        }
/*        process.nextTick(function () {
            // Force closing the connection while the command did not yet return
            client.end(true);
            redis.debug_mode = false;
        });*/

        callback(null,result)
    })
}

/**
 * 查询string类型的数据
 * @param key 键
 * @param callBack(err,result)
 */
db.get = function(key, callback){
    client.hgetall(key, function(err,result){
        if (err) {
            console.log("redis token失效");
            callback(err,null)
            return;
        }
        callback(null,result);
    });
}

/**
 * 删除
 * @param key 键
 * @param callBack(err,result)
 */
db.del = function(key, callback){
    client.del(key, function(err,result){
        if (err) {
            console.log(err);
            callback(err,null)
            return;
        }
        callback(null,result);
    });
}


module.exports = db;
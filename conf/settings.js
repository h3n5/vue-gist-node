var settings={};
settings.param = {
    useRedis: false //true=启用redis, false启用session
};
settings.javaParam = {
    url: "https://51yunqi.cn/",//url
    project:""//项目名
};
settings.authParam = {
    cookie_name: process.env.AUTH_COOKIE_NAME || 'hz_node2',//cookie 名字
    session_secret: process.env.SESSION_SECRET || 'm76y24',//session加密串
    cookie_secret: process.env.COOKIE_SECRET || 'm76y24',//session加密串
};

settings.page = {
    pageSize: 20//默认分页大小
};

module.exports = settings;
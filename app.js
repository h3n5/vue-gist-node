var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');//引用session
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');//跨域包
var routes = require('./routes/index');
global.rootReq = require('app-root-path').require;//根目录获取lib包

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('html',ejs.__express);
//app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors());//使用跨域
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//session
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, //如果为false,每次访问session不固定值,session被引用才会固定,true则固定.(don't create session until something stored)
  secret: 'mysecret',
  cookie:{
    maxAge: 1000*60*60*8 // 保存session时长8小时
  },
  /*store: new RedisStore({//采用redis存储
        host: '127.0.0.1',
        port: 6379,
        pass: '',
        db: 1//1号库
    })*/
}));

app.use(cookieParser());//使用cookie
app.use(express.static(path.join(__dirname, 'public')));//静态文件存放的目录
//app.use('/', routes);
routes.doRoute(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
    res.status(err.status || 404);
    res.render('err404', {
        message: "页面找不到"
    });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

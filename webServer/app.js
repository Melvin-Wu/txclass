var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var compression = require("compression");
var async = require("async");
var child_process = require("child_process");
var routes = require('./routes/index');
var users = require('./routes/users');
var domain = require('domain');

var app = express();

var fs = require("fs");
app.fs = fs;

var URL = require("url");
app.URL = URL;

// create a write stream (in append mode) 
var logDirectory = __dirname + '/logs'
var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false,
    date_format: "YYYY-MM-DD"
})
//var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})
app.accessLogStream = accessLogStream;
  
// setup the logger 
//app.use(morgan('short', {stream: accessLogStream}))
app.use(morgan("[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms", {stream: accessLogStream}));

var simple_ssh = require("simple-ssh");
app.simple_ssh = simple_ssh;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("ucloud.cn"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(express.static(__dirname + '/public'));

//日志
var log4js = require("log4js");
log4js.configure({
    "appenders": [
        {
            "type": "console"
        },
        {
            "type": "file",
            "filename": "logs/error.log",
            "maxLogSize": 1024 * 1024 * 50,
            "backups": 100
        }
    ]
});

var logger = log4js.getLogger(path.basename(__filename));
app.logger = logger;

var mysql = require("mysql");
app.mysql = mysql;

var os = require('os');
app.os = os;

app.use(function(req, res, next){
    //var cas = require("./cas.js");
    //cas.main(app, req, res, next);
    next();
});

app.use(function(req, res, next){
    if(req.path == "" || req.path == "/"){
        //res.redirect("ucdn/index.cgi");
    }else{
        next();
    }
});


//使得ejs
app.set("view engine","ejs");  

var md = domain.create();                                                                  
        
md.on('error', function(err) {                                                        
	logger.info("********************error in domain************************");         
	logger.error("err:" + err);                                                           
	logger.info("************************end**********************************");         
	
});

md.run(function () {                                                                       
	var tx = require("./txcourse/txcourse.js");
	tx.main(app, md);
});         

//指定静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

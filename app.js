var express = require('express');
var expressSession = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var socket_io = require('socket.io');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var index = require('./routes/index.js');
var api = require('./routes/api.js');


var app = express();

//setup the appRoot global 

global.appRoot = path.resolve(__dirname);

/**
 * Setup Socket IO
 */

var io = socket_io();
app.io = io;
io.on("connection", function (socket) {
  console.log("A user connected");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressSession({
  secret: 'my name is raj raj raj, what is your name please?',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v0/', api);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

try {
  var imagePurger = require('./common/filePurge.js');
  //start file watcher
  imagePurger.startWatching(io);
} catch (err) {
  console.log(`Filepurge: ${err}`);
}

module.exports = app;
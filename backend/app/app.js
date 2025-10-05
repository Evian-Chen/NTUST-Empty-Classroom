const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const portNum = process.env.PORT || 3000;
const cors = require("cors");  // 處理vite的跨網域問題
const bodyParser = require("body-parser");
const history = require("connect-history-api-fallback");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 跨域設定
app.use(cors({
  origin: "http://localhost:5173", // 開發中的vue預設server
  methods: ["GET", "POST"],
  credential: true
}));

// 解析urlencoded的資料型態 (前端傳來的資料)
app.use(
  bodyParser.urlencoded({
    extend: false,
    limit: "1mb",
    parameterLimit: "10000",
  })
);

// router
const indexRouter = require('./routes/index');
const availabilityRouter = require('./routes/availability');
const buildingsRouter = require('./routes/buildings');
const calenderRouter = require('./routes/calendar');
const roomRouter = require('./routes/room')
const visitRouter = require('./routes/visit')

app.use('/', indexRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/calendar', calenderRouter);
app.use('/api/room', roomRouter);
app.use('/api/visit', visitRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// history 中介器
app.use(history());

// 連接靜態檔案
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.listen(portNum, () => {
  console.log(`running on port: ${portNum}`);
});

module.exports = app;

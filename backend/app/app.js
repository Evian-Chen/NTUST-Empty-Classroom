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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const allowed = [
  "http://localhost:5173",
  "http://192.168.227.59:5173/",
  "https://ntust-empty-classroom.vercel.app",
  "ntust-empty-classroom.vercel.app",
  "https://ntust-empty-classroom.vercel.app/api",
  "https://localhost:3000",
]

// 跨域設定
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser tools (no Origin) like curl/cron
    if (!origin) return cb(null, true);
    cb(null, allowed.includes(origin));
  },
  method: ["GET", "POST"],
  credentials: false // 你目前沒用 cookie，可設 false
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
const searchRouter = require('./routes/search')
const healthzRouter = require('./routes/healthz');

app.use('/', indexRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/buildings', buildingsRouter);
app.use('/api/calendar', calenderRouter);
app.use('/api/room', roomRouter);
app.use('/api/visit', visitRouter);
app.use('/api/search', searchRouter);
app.use('/api/healthz', healthzRouter);

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

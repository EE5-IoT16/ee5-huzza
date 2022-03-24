var express = require('express');

var indexRouter = require('./routes/index');
var accelerometerRouter = require('./routes/accelerometerRoutes');
var heartRateRouter = require('./routes/heartRateRouter');
var gyroRouter = require('./routes/gyroRouter');
var temperatureRouter = require('./routes/temperatureRouter');
var userRouter = require('./routes/userRouter');

var app = express();

app.use('/', indexRouter);
app.use('/accel', accelerometerRouter);
app.use('/heartRate', heartRateRouter);
app.use('/gyro', gyroRouter);
app.use('/temperature', temperatureRouter);
app.use('/user', userRouter);

module.exports = app;

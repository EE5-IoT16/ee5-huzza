var express = require('express');

var indexRouter = require('./routes/index');
var accelerometerRouter = require('./routes/accelerometerRoutes');
var heartRateRouter = require('./routes/heartRateRouter');
var gyroRouter = require('./routes/gyroRouter');
var temperatureRouter = require('./routes/temperatureRouter');

var app = express();

app.use('/', indexRouter);
app.use('/accel', accelerometerRouter);
app.use('/heartRate', heartRateRouter);
app.use('/gyro', gyroRouter);
app.use('/temperature', temperatureRouter);

module.exports = app;

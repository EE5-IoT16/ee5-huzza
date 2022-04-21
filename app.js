var express = require('express');

// generic_routes
var indexRouter = require('./routes/generic_routes/index');
var errorRouter = require('./routes/generic_routes/errorRouter');

// profile_routes
var profileRouter = require('./routes/profile_routes/profileRouter');

// user_routes
var userRouter = require('./routes/user_routes/userRouter');
var physicalDataRouter = require('./routes/user_routes/userPhysicalData');
var stepsRouter = require('./routes/user_routes/stepsRoutes');
var fallsRouter = require('./routes/user_routes/fallsRouter');
var heartRateRouter = require('./routes/user_routes/heartRateRouter');
var temperatureRouter = require('./routes/user_routes/temperatureRouter');

var app = express();

app.use('/', indexRouter);
app.use('/steps', stepsRouter);
app.use('/heartRate', heartRateRouter);
app.use('/falls', fallsRouter);
app.use('/temperature', temperatureRouter);
app.use('/profile', profileRouter);
app.use('/user', userRouter);
app.use('/physicalData', physicalDataRouter);

app.use('*', errorRouter);

module.exports = app;

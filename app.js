var express = require('express');

// generic_routes
var indexRouter = require('./routes/generic_routes/index');
var errorRouter = require('./routes/generic_routes/errorRouter');
var quotesRouter = require('./routes/generic_routes/quotes');

// profile_routes
var profileRouter = require('./routes/profile_routes/profileRouter');
var profileUserLinkRouter = require('./routes/profile_routes/profileUserLinkRouter');

// user_routes
var userRouter = require('./routes/user_routes/userRouter');
var physicalDataRouter = require('./routes/user_routes/userPhysicalData');
var stepsRouter = require('./routes/user_routes/stepsRoutes');
var fallsRouter = require('./routes/user_routes/fallsRouter');
var heartRateRouter = require('./routes/user_routes/heartRateRouter');
var temperatureRouter = require('./routes/user_routes/temperatureRouter');
var activitiesRouter = require('./routes/user_routes/activitiesRouter');
var heartPoints = require('./routes/user_routes/heartPoints');

// periodic_routes
var dailyRouter = require('./routes/periodic_routes/dailyRouter');
var weeklyRouter = require('./routes/periodic_routes/weeklyRouter');
var monthlyRouter = require('./routes/periodic_routes/monthlyRouter');
var tenMinutesRouter = require('./routes/periodic_routes/tenMinutesRouter');

// achievements_router
var goalsRouter = require('./routes/achievements_routes/goalsRouter');
var recordsRouter = require('./routes/achievements_routes/recordsRouter');
var goalsCompletedRouter = require('./routes/achievements_routes/goalsCompletedRouter');

var app = express();

app.use('/', indexRouter);
app.use('/steps', stepsRouter);
app.use('/heartRate', heartRateRouter);
app.use('/falls', fallsRouter);
app.use('/temperature', temperatureRouter);
app.use('/profile', profileRouter);
app.use('/user', userRouter);
app.use('/physicalData', physicalDataRouter);
app.use('/daily', dailyRouter);
app.use('/weekly', weeklyRouter);
app.use('/monthly', monthlyRouter);
app.use('/goals', goalsRouter);
app.use('/records', recordsRouter);
app.use('/goalsCompleted', goalsCompletedRouter);
app.use('/activity', activitiesRouter);
app.use('/profileUserLink', profileUserLinkRouter);
app.use('/tenMinutes', tenMinutesRouter);
app.use('/heartPoints', heartPoints);
app.use('/quotes', quotesRouter);

app.use('*', errorRouter);

module.exports = app;

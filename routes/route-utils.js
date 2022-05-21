const db = require("../database");

module.exports = routeUtils = (() => {
    function routeUtils() { };

    routeUtils.prototype.getTimeStamp = function () {
        let date = new Date();
        let ts = "";

        ts += date.getUTCFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " ";
        ts += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return ts;
    };

    routeUtils.prototype.getDayRange = function () {
        let date = new Date();
        let ts = { start: "", end: "" };

        ts.start += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        let tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        ts.end += tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate();

        return ts;
    };

    routeUtils.prototype.getWeekRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        let tomorrow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate();

        return ts;
    };

    routeUtils.prototype.getMonthRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

        let tomorrow = new Date(Date.now() - date.getUTCDate() * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate();

        return ts;
    };

    routeUtils.prototype.getTenMinuteRange = function () {
        let date = new Date();
        let ts = { start: "", end: "" };

        ts.start += date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":00";

        let tomorrow = new Date(Date.now() - 9 * 60 * 1000);
        ts.end += tomorrow.getFullYear() + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate() + " " + tomorrow.getHours() + ":" + tomorrow.getMinutes() + ":00";

        return ts;
    };

    routeUtils.prototype.getStepsWithInterval = async function (userId, timeRange) {
        const queryString = 'SELECT SUM(steps) AS "totalSteps" FROM public."Steps" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \'' + timeRange.start + '\' AND \'' + timeRange.end + '\'';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getHeartRateWithInterval = async function (userId, timeRange) {
        const queryString = 'SELECT * FROM public."HeartRate" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \'' + timeRange.start + '\' AND \'' + timeRange.end + '\'';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getHeartPointsWithInterval = async function (userId, timeRange) {
        const queryString = 'SELECT SUM("heartPoint") AS "totalHeartPoints" FROM public."HeartPoints" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \'' + timeRange.start + '\' AND \'' + timeRange.end + '\'';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getMaxStepWithInterval = async function (timeFrame, userId) {
        const queryString = 'SELECT DATE_TRUNC(\'' + timeFrame + '\', ts) AS date, SUM(steps) AS totalStep FROM public."Steps" WHERE "userId"=' + userId + ' GROUP BY date ORDER BY totalStep DESC LIMIT 1;';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getMaxHeartPointsWithInterval = async function (timeFrame, userId) {
        const queryString = 'SELECT DATE_TRUNC(\'' + timeFrame + '\', ts) AS date, SUM("heartPoint") AS totalHeartPoint FROM public."HeartPoints" WHERE "userId"=' + userId + ' GROUP BY date ORDER BY totalHeartPoint DESC LIMIT 1;';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getUserPhysicalDataWithId = async function (userId) {
        let queryString = 'SELECT * FROM "UserPhysicalData"';
        queryString += 'WHERE "userId"=' + userId;
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.calculateCaloriesBurned = function (gender, weight, height, age) {
        let caloriesBurned = 0;

        // Need new formula that uses time spend as well;
        if (gender = "male") {
            caloriesBurned = 66 + (6.23 * 2.2 * weight) + (12.7 * 0.3937 * height) - (4.7 * age);
        }
        else if (gender = "female") {
            caloriesBurned = 655 + (4.35 * 2.2 * weight) + (4.7 * 0.3937 * height) - (4.7 * age);
        }
        else {
            // I have made up this formula
            caloriesBurned = 300 + (5.23 * 2.2 * weight) + (8.7 * 0.3937 * height) - (4.7 * age);
        }
        caloriesBurned = caloriesBurned.toFixed(2);
        return caloriesBurned;
    };

    routeUtils.prototype.calculateDistanceCovered = function (steps, height, gender) {
        let distanceCovered;

        if (gender = "male") {
            distanceCovered = 0.762 * steps;
        }
        else if (gender = "female") {
            distanceCovered = 0.67 * steps;
        }
        else {
            distanceCovered = 0.716 * steps;
        }

        distanceCovered = distanceCovered.toFixed(2);
        return distanceCovered;
    };

    routeUtils.prototype.postEmptySteps = async function () {
        const day_ts = this.getDayRange();
        let queryString = 'SELECT "userId" FROM public."User"';
        let userIds = await db.query(queryString);
        let result;

        for (var i = 0; i < userIds.rows.length; i++) {
            var userId = userIds.rows[i].userId;
            queryString = 'SELECT * FROM public."Steps" WHERE "userId"=' + userId + ' AND  ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
            result = await db.query(queryString);

            if (result.rows.length === 0) {
                let step = 0;
                let ts = this.getTimeStamp();
                queryString = 'INSERT INTO public."Steps"("userId","steps","ts")VALUES ($1, $2, $3) RETURNING "userId"';
                let queryValues = [userId, step, ts];
                result = await db.query(queryString, queryValues);
            }
        }
    };

    routeUtils.prototype.postEmptyHeartPoints = async function () {
        const day_ts = this.getDayRange();
        let queryString = 'SELECT "userId" FROM public."User"';
        let userIds = await db.query(queryString);
        let result;

        for (var i = 0; i < userIds.rows.length; i++) {
            var userId = userIds.rows[i].userId;
            queryString = 'SELECT * FROM public."HeartPoints" WHERE "userId"=' + userId + ' AND  ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
            result = await db.query(queryString);

            if (result.rows.length === 0) {
                let heartPoint = 0;
                let ts = this.getTimeStamp();
                queryString = 'INSERT INTO public."HeartPoints"("userId","heartPoint","ts")VALUES ($1, $2, $3) RETURNING "userId"';
                let queryValues = [userId, heartPoint, ts];
                result = await db.query(queryString, queryValues);
            }
        }
    };

    routeUtils.prototype.postEmptyGoalsCompleted = async function () {
        const day_ts = this.getDayRange();
        let queryString = 'SELECT "userId" FROM public."User"';
        let userIds = await db.query(queryString);
        let result;

        for (var i = 0; i < userIds.rows.length; i++) {
            var userId = userIds.rows[i].userId;
            queryString = 'SELECT * FROM public."GoalsCompleted" WHERE "userId"=' + userId + ' AND  ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
            result = await db.query(queryString);

            if (result.rows.length === 0) {                
                let isHeartPointsCompleted = false;
                let isStepsCompleted = false;
                let ts = this.getTimeStamp();
                let currentStreak = 0;
                queryString = 'INSERT INTO public."GoalsCompleted"("userId","isStepsCompleted", "isHeartPointsCompleted","ts", "currentStreak")VALUES ($1, $2, $3, $4, $5) RETURNING "userId"';
                let queryValues = [userId, isStepsCompleted, isHeartPointsCompleted, ts, currentStreak];
                result = await db.query(queryString, queryValues);
            }
        }
    };

    return routeUtils;
})();
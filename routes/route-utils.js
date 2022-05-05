const db = require("../database");

module.exports = routeUtils = (() => {
    function routeUtils() { };

    routeUtils.prototype.getTimeStamp = function () {
        let date = new Date();
        let ts = "";

        ts += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " ";
        ts += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return ts;
    };

    routeUtils.prototype.getDayRange = function () {
        let date = new Date();
        let ts = { start: "", end: "" };

        ts.start += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

        let tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        ts.end += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    routeUtils.prototype.getWeekRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

        let tomorrow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    routeUtils.prototype.getMonthRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

        let tomorrow = new Date(Date.now() - date.getUTCDate() * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    routeUtils.prototype.getStepsWithInterval = async function (userId, timeRange) {
        const queryString = 'SELECT * FROM public."Steps" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \'' + timeRange.start + '\' AND \'' + timeRange.end + '\'';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getHeartRateWithInterval = async function (userId, timeRange) {
        const queryString = 'SELECT * FROM public."HeartRate" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \'' + timeRange.start + '\' AND \'' + timeRange.end + '\'';
        const { rows } = await db.query(queryString);
        return rows;
    };

    routeUtils.prototype.getMaxStepWithInterval = async function (timeFrame, userId) {
        const queryString = 'SELECT DATE_TRUNC(\'' + timeFrame + '\', ts) AS date, SUM(steps) AS totalStep FROM public."Steps" WHERE "userId"=' + userId + ' GROUP BY date ORDER BY totalStep DESC LIMIT 1;';
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
        return distanceCovered;
    };
    
    return routeUtils;
})();
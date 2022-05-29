var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Activities"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Activities"';
        queryString += 'WHERE "userId"=' + req.params.id;
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        let queryString, result, returnResult;
        let queryValues = [];

        const userId = req.query.userId;
        if (userId) {
            const startTime = req.query.startTime;
            const endTime = req.query.endTime;

            let steps = await routerUtils.getMaxStepWithInterval('day', userId);

            if (startTime && !endTime) {
                queryString = 'INSERT INTO public."Activities"("userId", "startTime", "steps")VALUES ($1, $2, $3) RETURNING "userId"';
                queryValues = [userId, startTime, steps[0].totalstep];
            }
            else if (startTime && endTime) {
                const userPhysicalData = await routerUtils.getUserPhysicalDataWithId(userId);
                const caloriesBurned = routerUtils.calculateCaloriesBurned(userPhysicalData[0].gender, userPhysicalData[0].weight, userPhysicalData[0].height, userPhysicalData[0].age);

                // Get todays activity
                queryString = 'SELECT steps FROM public."Activities" WHERE "userId"=' + userId + ' AND "startTime"= \'' + startTime + '\';';
                result = await db.query(queryString);
                steps = steps[0].totalstep - result.rows[0].steps;
                const distanceCovered = routerUtils.calculateDistanceCovered(steps, userPhysicalData[0].height, userPhysicalData[0].gender,)

                result = await routerUtils.getHeartRateWithInterval(userId, { "start": startTime, "end": endTime });
                const averageHeartRate = result.reduce((total, next) => total + next.bpm, 0) / result.length;
                const maxHeartRate = Math.max(...result.map(o => o.bpm));

                let startTimeHours = startTime.split("T")[1];
                let startTimeHoursArray = startTimeHours.split(":");

                let endTimeHours = endTime.split("T")[1];
                let endTimeHoursArray = endTimeHours.split(":");

                let finalTime = Math.abs(parseInt(endTimeHoursArray[0]) - parseInt(startTimeHoursArray[0])) > 1 ? (Math.abs(parseInt(endTimeHoursArray[0]) - parseInt(startTimeHoursArray[0])) - 1) * 60 : 0 + Math.abs(parseInt(endTimeHoursArray[1]) + 60 - parseInt(startTimeHoursArray[1]));

                let heartRateIntensity = (averageHeartRate / userPhysicalData[0].maxHeartRate) * 100;
                let heartPoints = 0;
                if (heartRateIntensity >= 50 && heartRateIntensity < 70) {
                    heartPoints = finalTime * 1;
                }
                else if (heartRateIntensity >= 70) {
                    heartPoints = finalTime * 2;
                }
                heartPoints = heartPoints.toFixed(2);

                queryString = 'INSERT INTO public."HeartPoints"("userId", "heartPoint", "ts")VALUES ($1, $2, $3) RETURNING "userId"';
                queryValues = [userId, heartPoints, endTime];
                await db.query(queryString, queryValues);

                queryString = 'UPDATE public."Activities" SET "endTime"=$1, "caloriesBurned"=$2, "maxHeartRate"=$3, "averageHeartRate"=$4, "steps"=$5, "distanceCovered"=$6 WHERE "userId"=$7 AND "startTime"=$8 RETURNING "userId";';
                queryValues = [endTime, caloriesBurned, maxHeartRate, averageHeartRate, steps, distanceCovered, userId, startTime];
            }

            result = await db.query(queryString, queryValues);
            returnResult = result.rows;
        }
        else {
            returnResult = {};
        }
        res.send(returnResult);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
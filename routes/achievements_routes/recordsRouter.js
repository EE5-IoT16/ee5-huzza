const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Records"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Records"';
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
        let result, returnValue;
        let parameterCounter = 1;

        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();
        const userId = req.query.userId;

        if (userId) {
            let maxMonthStep = await routerUtils.getMaxStepWithInterval('month', userId);
            if (maxMonthStep.length > 0) { maxMonthStep = maxMonthStep[0].totalstep; }
            else { maxMonthStep = 0; }

            let maxWeekStep = await routerUtils.getMaxStepWithInterval('week', userId);
            if (maxWeekStep.length > 0) { maxWeekStep = maxWeekStep[0].totalstep; }
            else { maxWeekStep = 0; }

            let maxDayStep = await routerUtils.getMaxStepWithInterval('day', userId);
            if (maxDayStep.length > 0) { maxDayStep = maxDayStep[0].totalstep; }
            else { maxDayStep = 0; }

            let maxMonthHeartPoints = await routerUtils.getMaxHeartPointsWithInterval('month', userId);
            if (maxMonthHeartPoints.length > 0) { maxMonthHeartPoints = maxMonthHeartPoints[0].totalheartpoint; }
            else { maxMonthHeartPoints = 0; }

            let maxWeekHeartPoints = await routerUtils.getMaxHeartPointsWithInterval('week', userId);
            if (maxWeekHeartPoints.length > 0) { maxWeekHeartPoints = maxWeekHeartPoints[0].totalheartpoint; }
            else { maxWeekHeartPoints = 0; }

            let maxDayHeartPoints = await routerUtils.getMaxHeartPointsWithInterval('day', userId);
            if (maxDayHeartPoints.length > 0) { maxDayHeartPoints = maxDayHeartPoints[0].totalheartpoint; }
            else { maxDayHeartPoints = 0; }

            let queryString = 'SELECT * FROM public."GoalsCompleted" WHERE "userId" = $1';
            let queryValues = [userId];
            result = await db.query(queryString, queryValues);

            let maxStreak = 0;
            if (result.rows.length > 0){
                maxStreak = Math.max(...result.rows.map(o => o.currentStreak));
            }
            else{
                maxStreak = 0;
            }
            

            queryString = 'SELECT * FROM public."Records" WHERE "userId" = $1';
            queryValues = [userId];
            result = await db.query(queryString, queryValues);

            if (result.rows.length) {
                queryValues = [];
                queryString = 'UPDATE public."Records" SET ';
                if (maxMonthStep > result.rows[0].maxStepMonth) {
                    queryValues.push(maxMonthStep);
                    queryString += '"maxStepMonth" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxWeekStep > result.rows[0].maxStepWeek) {
                    queryValues.push(maxWeekStep);
                    queryString += '"maxStepWeek" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxDayStep > result.rows[0].maxStepDay) {
                    queryValues.push(maxDayStep);
                    queryString += '"maxStepDay" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxMonthHeartPoints > result.rows[0].maxHeartPointMonth) {
                    queryValues.push(maxMonthHeartPoints);
                    queryString += '"maxHeartPointMonth" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxWeekHeartPoints > result.rows[0].maxHeartPointWeek) {
                    queryValues.push(maxWeekHeartPoints);
                    queryString += '"maxHeartPointWeek" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxDayHeartPoints > result.rows[0].maxHeartPointDay) {
                    queryValues.push(maxDayHeartPoints);
                    queryString += '"maxHeartPointDay" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (maxStreak > result.rows[0].streak) {
                    queryValues.push(maxStreak);
                    queryString += '"streak" = $' + parameterCounter + " ,";
                    parameterCounter++;
                }

                if (queryValues.length > 0) {
                    queryString = queryString.replace(/,*$/, "");
                    queryString += 'WHERE "userId" = $' + parameterCounter + ' RETURNING "userId"';
                    queryValues.push(userId);

                    result = await db.query(queryString, queryValues);
                    returnValue = result.rows;
                }
                else {
                    returnValue = [];
                }
            }
            else {
                queryString = 'INSERT INTO public."Records"("userId","maxStepDay","maxStepWeek", "maxStepMonth", "maxHeartPointDay","maxHeartPointWeek","maxHeartPointMonth","streak","ts")VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "userId"';
                queryValues = [userId, maxDayStep, maxWeekStep, maxMonthStep, maxDayHeartPoints, maxWeekHeartPoints, maxMonthHeartPoints, maxStreak, ts];

                result = await db.query(queryString, queryValues);
                returnValue = result.rows;
            }

        }
        else {
            returnValue = [];
        }

        res.send(returnValue);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
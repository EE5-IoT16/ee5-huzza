const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Records"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "Records"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    let result, returnValue;
    let parameterCounter = 1;

    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;

    if (userId) {
        let maxMonthStep = await routerUtils.getMaxStepWithInterval('month', userId);
        if (maxMonthStep.length > 0) { maxMonthStep = maxMonthStep[0].totalstep; }
        else {maxMonthStep = 0;}

        let maxWeekStep = await routerUtils.getMaxStepWithInterval('week', userId);
        if (maxWeekStep.length > 0) { maxWeekStep = maxWeekStep[0].totalstep; }
        else {maxWeekStep = 0;}

        let maxDayStep = await routerUtils.getMaxStepWithInterval('day', userId);
        if (maxDayStep.length > 0) { maxDayStep = maxDayStep[0].totalstep; }
        else {maxDayStep = 0;}

        let queryString = 'SELECT * FROM public."Records" WHERE "userId" = $1';
        let queryValues = [userId]
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

            if (queryValues.length > 0) {
                queryString = queryString.replace(/,*$/, "");
                queryString += 'WHERE "userId" = $' + parameterCounter + ' RETURNING "userId"';
                queryValues.push(userId);

                result = await db.query(queryString, queryValues);
                returnValue = result.rows;
            }
            else {
                returnValue = "No values has changed";
            }
        }
        else {
            queryString = 'INSERT INTO public."Records"("userId","maxStepDay","maxStepWeek", "maxStepMonth","ts")VALUES ($1, $2, $3, $4, $5) RETURNING "userId"';
            queryValues = [userId, maxDayStep, maxWeekStep, maxMonthStep, ts];

            result = await db.query(queryString, queryValues);
            returnValue = result.rows;
        }

    }
    else {
        returnValue = "userId is not provided.";
    }

    res.send(returnValue);
});

module.exports = router;

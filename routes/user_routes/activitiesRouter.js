var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Activities"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "Activities"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    let routerUtils = new RouterUtils();    
    let queryString, result, returnResult;
    let queryValues = [];

    const userId = req.query.userId;
    if (userId) {
        const startTime = req.query.startTime;
        const endTime = req.query.endTime;

        let steps = routerUtils.getMaxStepWithInterval('day', userId);

        if (startTime && !endTime) {
            queryString = 'INSERT INTO public."Activities"("userId", "startTime", "steps")VALUES ($1, $2, $3) RETURNING "userId"';
            queryValues = [userId, startTime, steps];
        }
        else if (startTime && endTime) {
            const userPhysicalData = await routerUtils.getUserPhysicalDataWithId(userId);
            const caloriesBurned = routerUtils.calculateCaloriesBurned(userPhysicalData[0].gender, userPhysicalData[0].weight, userPhysicalData[0].height, userPhysicalData[0].age);

            // Get todays activity
            queryString = 'SELECT steps FROM public."Activities" WHERE "userId"=' + userId + ' AND "startTime"= '+ startTime + ';';
            result = await db.query(queryString);
            steps = result.rows[0].steps - steps;

            queryString = 'INSERT INTO public."Activities"("userId", "endTime", "steps", "caloriesBurned")VALUES ($1, $2, $3, $4) RETURNING "userId"';
            queryValues = [userId, endTime, steps, caloriesBurned];
        }

        result = await db.query(queryString, queryValues);
        returnResult = result.rows;
    }
    else {

    }
    res.send(returnResult);
});

module.exports = router;
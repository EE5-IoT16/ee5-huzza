var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "GoalsCompleted"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "GoalsCompleted"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;
    const stepsCompleted = req.query.stepsCompleted;
    const hpCompleted = req.query.hpCompleted;
    let currentStreak = 0;
    let queryValues;

    const day_ts = routerUtils.getDayRange();
    let queryString = 'SELECT * FROM public."GoalsCompleted" WHERE "userId"=' + userId + ' AND  ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
    let result = await db.query(queryString);

    queryString = 'SELECT * FROM public."GoalsCompleted" WHERE ts::date = (current_date - INTEGER \'1\') AND "userId"=' + userId + ';';
    let currentStreakDB = await db.query(queryString);

    if (result.rows.length > 0 && (result.rows[0].isStepsCompleted != stepsCompleted || result.rows[0].isHeartPointsCompleted != hpCompleted)) {
        if (currentStreakDB.rows.length > 0 && (stepsCompleted === 'true' || result.rows[0].isStepsCompleted === 'true') && (hpCompleted === 'true' || result.rows[0].isHeartPointsCompleted === 'true')) {
            currentStreak = currentStreakDB.rows[0].currentStreak + 1;
        }

        queryString = 'UPDATE public."GoalsCompleted" SET "isStepsCompleted"=$1, "isHeartPointsCompleted" = $2, "currentStreak" = $3, ts=$4 WHERE "userId"=$5 AND id=$6 RETURNING "userId"';
        queryValues = [stepsCompleted, hpCompleted, currentStreak, ts, userId, result.rows[0].id];

        result = await db.query(queryString, queryValues);
    }
    else {
        if (currentStreakDB.rows.length > 0 && stepsCompleted === 'true' && hpCompleted == 'true') {
            currentStreak = currentStreakDB.rows[0].currentStreak + 1;
        }

        queryString = 'INSERT INTO public."GoalsCompleted"("userId", "isStepsCompleted", "isHeartPointsCompleted","ts", "currentStreak")VALUES ($1, $2, $3, $4, $5) RETURNING "userId"';
        queryValues = [userId, stepsCompleted, hpCompleted, ts, currentStreak];

        result = await db.query(queryString, queryValues);
    }
    res.send(result.rows);
});

module.exports = router;
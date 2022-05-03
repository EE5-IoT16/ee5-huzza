var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    const queryString = 'SELECT * FROM "Steps"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res, next) => {
    let queryString = 'SELECT * FROM "Steps"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res, next) => {
    const step = req.query.steps;

    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;

    const day_ts = routerUtils.getDayRange();

    let queryString = 'SELECT * FROM public."Steps" WHERE ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
    let result = await db.query(queryString);
    if (result.rows.length > 0) {
        queryString = 'UPDATE public."Steps" SET steps = $1 WHERE id= $2 RETURNING "userId"';
        result = await db.query(queryString, [parseInt(result.rows[0].steps) + parseInt(step), result.rows[0].id]);
    }
    else {
        queryString = 'INSERT INTO public."Steps"("userId","steps","ts")VALUES ($1, $2, $3) RETURNING "userId"';
        const queryValues = [userId, step, ts];
        result = await db.query(queryString, queryValues);
    }
    res.send(result.rows);
});

router.put('/', function (req, res, next) {
    res.send('Steps put method called.');
});

router.delete('/', function (req, res, next) {
    res.send('Steps delete method called.');
});

module.exports = router;

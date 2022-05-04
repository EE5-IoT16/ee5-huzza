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

    const queryString = 'INSERT INTO public."GoalsCompleted"("userId", "isStepsCompleted", "isHeartPointsCompleted","ts")VALUES ($1, $2, $3, $4) RETURNING "userId"';
    const queryValues = [userId, stepsCompleted, hpCompleted, ts];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

module.exports = router;
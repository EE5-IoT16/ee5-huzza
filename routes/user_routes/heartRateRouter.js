const express = require('express');
const router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "HeartRate"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "HeartRate"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const bpm = req.query.bpm;
    
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;

    const queryString = 'INSERT INTO public."HeartRate"("userId","bpm","ts")VALUES ($1, $2, $3) RETURNING "userId"';
    const queryValues = [userId, bpm, ts];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res, next) {
    res.send('Heart rate put method called.');
});

router.delete('/', function (req, res, next) {
    res.send('Heart rate delete method called.');
});

module.exports = router;

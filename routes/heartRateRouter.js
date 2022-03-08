const express = require('express');
const router = express.Router();
const db = require("../database")
let RouterUtils = require("./route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "HeartRate"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const bpm = req.query.bpm;
    //There should be a better methodology to this
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const deviceId = req.query.deviceId;

    const queryString = 'INSERT INTO public."HeartRate"("deviceId","bpm","ts")VALUES ($1, $2, $3) RETURNING "id"';
    const queryValues = [deviceId, bpm, ts];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res, next) {
    res.send('Heart rate put method called.');
    const filterDoc = req.query.type;
    const newDoc = req.query;
    db.update(filterDoc, newDoc)
});

router.delete('/', function (req, res, next) {
    res.send('Heart rate delete method called.');
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require("../database")
let RouterUtils = require("./route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Gyroscope"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const angle = req.query.angle;
    const angularVelocity = req.query.angularVelocity;
    //There should be a better methodology to this
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const deviceId = req.query.deviceId;

    const queryString = 'INSERT INTO public."Gyroscope"("deviceId","angle","angularVelocity","ts")VALUES ($1, $2, $3, $4) RETURNING "id"';
    const queryValues = [deviceId, angle, angularVelocity, ts];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res, next) {
    res.send('Gyroscope put method called.');
});

router.delete('/', function (req, res, next) {
    res.send('Gyroscope delete method called.');
});

module.exports = router;

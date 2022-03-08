var express = require('express');
var router = express.Router();
const db = require("../database")
let RouterUtils = require("./route-utils");

router.get('/', async(req, res) => {
    const queryString = 'SELECT * FROM "Temperature"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res) => {
    const temperature = req.query.temperature;
    //There should be a better methodology to this
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const deviceId = req.query.deviceId;

    const queryString = 'INSERT INTO public."Temperature"("deviceId","temperature","ts")VALUES ($1, $2, $3) RETURNING "id"';
    const queryValues = [deviceId, temperature, ts];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function(req, res, next) {
    res.send('Temperature put method called.');
});

router.delete('/', function(req, res, next) {
    res.send('Temperature delete method called.');
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require("../database")
let RouterUtils = require("./route-utils");

router.get('/', async (req, res, next) => {    
    const queryString = 'SELECT * FROM "Acceleration"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res, next) => {    
    let queryString = 'SELECT * FROM "Acceleration"';
    queryString += "WHERE id=" + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res, next) => {
    const acceleration = req.query.acceleration;
    //There should be a better methodology to this
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const deviceId = req.query.deviceId;

    const queryString = 'INSERT INTO public."Acceleration"("deviceId","acceleration","ts")VALUES ($1, $2, $3) RETURNING "id"';
    const queryValues = [deviceId, acceleration, ts];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function(req, res, next) {
    res.send('Accelerometer put method called.');
});

router.delete('/', function(req, res, next) {
    res.send('Accelerometer delete method called.');
});

module.exports = router;

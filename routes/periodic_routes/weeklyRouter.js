var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/heartRate', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getWeekRange();
    
    const queryString = 'SELECT * FROM public."HeartRate" WHERE ts BETWEEN SYMMETRIC \'' + ts.start + '\' AND \''+ ts.end +'\'';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/steps', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getWeekRange();

    const queryString = 'SELECT * FROM public."Steps" WHERE ts BETWEEN SYMMETRIC \'' + ts.start + '\' AND \''+ ts.end +'\'';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/heartRate', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getMonthRange();
    
    res.send(routerUtils.getHeartRateWithInterval(ts));
});

router.get('/steps', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getMonthRange();

    res.send(routerUtils.getStepsWithInterval(ts));
});

module.exports = router;

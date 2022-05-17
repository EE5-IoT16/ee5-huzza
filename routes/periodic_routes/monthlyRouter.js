var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/heartRate/:userId', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getMonthRange();
    const userId = req.params.userId;
    const result = await routerUtils.getHeartRateWithInterval(userId,ts);
    
    res.send(result);
});

router.get('/steps/:userId', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getMonthRange();
    const userId = req.params.userId;
    const result = await routerUtils.getStepsWithInterval(userId, ts);

    res.send(result);
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/heartRate/:userId', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getWeekRange();
        const userId = req.params.userId;
        const result = await routerUtils.getHeartRateWithInterval(userId, ts);

        res.send(result);
    }
    catch (err) {
        next(err);
    }
});

router.get('/steps/:userId', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getWeekRange();
        const userId = req.params.userId;
        const result = await routerUtils.getStepsWithInterval(userId, ts);

        res.send(result);
    }
    catch (err) {
        next(err);
    }
});

router.get('/heartPoints/:userId', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getWeekRange();
        const userId = req.params.userId;
        const result = await routerUtils.getHeartPointsWithInterval(userId, ts);

        res.send(result);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

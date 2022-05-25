var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/heartRate/:userId', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTenMinuteRange();
        const userId = req.params.userId;
        const queryString = 'SELECT DATE_TRUNC(\'minute\', ts) AS minutes, ROUND(AVG(bpm), 2) AS "totalHeartPoints" FROM public."HeartRate" WHERE "userId"=' + userId + ' AND ts BETWEEN SYMMETRIC \' ' + ts.start + '\' AND \'' + ts.end + '\' GROUP BY minutes ORDER BY minutes;'
        const result = await db.query(queryString);

        res.send(result.rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

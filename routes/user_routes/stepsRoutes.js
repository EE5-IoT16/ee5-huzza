var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Steps"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Steps"';
        queryString += 'WHERE "userId"=' + req.params.id;
        queryString += 'ORDER BY id ASC';
        let {rows} = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let result;
        let step = req.query.steps;

        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();
        const userId = req.query.userId;

        const day_ts = routerUtils.getDayRange();

        if (userId) {
            let queryString = 'SELECT * FROM public."Steps" WHERE "userId"=' + userId + ' AND  ts BETWEEN SYMMETRIC \'' + day_ts.start + '\' AND \'' + day_ts.end + '\'';
            result = await db.query(queryString);
            if (result.rows.length > 0) {
                queryString = 'UPDATE public."Steps" SET steps = $1 WHERE id= $2 RETURNING "userId"';
                step = parseInt(step) + parseInt(result.rows[0].steps);
                result = await db.query(queryString, [step, result.rows[0].id]);
                result = result.rows;
            }
            else {
                result = [];
            }
            res.send(result.rows);
        }
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

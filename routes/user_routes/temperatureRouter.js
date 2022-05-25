var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Temperature"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Temperature"';
        queryString += 'WHERE "userId"=' + req.params.id;
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        let temperature = req.query.temperature;
        temperature = temperature.replace(/\s/g, "");
        temperature = parseInt(temperature);
        temperature = 21.0 + (temperature - 333.87 * 6) / 333.87;
        temperature = temperature.toFixed(2);

        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();
        const userId = req.query.userId;

        const queryString = 'INSERT INTO public."Temperature"("userId","temperature","ts")VALUES ($1, $2, $3) RETURNING "userId"';
        const queryValues = [userId, temperature, ts];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

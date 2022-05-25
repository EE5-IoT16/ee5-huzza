var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Falls"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Falls"';
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
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();
        const userId = req.query.userId;

        const queryString = 'INSERT INTO public."Falls"("userId","ts")VALUES ($1, $2) RETURNING "userId"';
        const queryValues = [userId, ts];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

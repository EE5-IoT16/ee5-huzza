var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Falls"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "Falls"';
    queryString += "WHERE userId=" + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {      
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;

    const queryString = 'INSERT INTO public."Falls"("userId","ts")VALUES ($1, $2) RETURNING "userId"';
    const queryValues = [userId, ts];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res, next) {
    res.send('Gyroscope put method called.');
});

router.delete('/', function (req, res, next) {
    res.send('Gyroscope delete method called.');
});

module.exports = router;

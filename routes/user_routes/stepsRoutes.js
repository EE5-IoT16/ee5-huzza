var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {    
    const queryString = 'SELECT * FROM "Steps"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res, next) => {    
    let queryString = 'SELECT * FROM "Steps"';
    queryString += "WHERE userId=" + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res, next) => {
    const step = req.query.acceleration;
    //There should be a better methodology to this
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;

    const queryString = 'INSERT INTO public."Steps"("userId","steps","ts")VALUES ($1, $2, $3) RETURNING "userId"';
    const queryValues = [userId, step, ts];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function(req, res, next) {
    res.send('Steps put method called.');
});

router.delete('/', function(req, res, next) {
    res.send('Steps delete method called.');
});

module.exports = router;

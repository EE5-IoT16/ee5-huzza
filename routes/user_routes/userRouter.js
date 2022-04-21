const express = require('express');
const router = express.Router();
const db = require("../../database")

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "User"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "User"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const deviceId = req.query.deviceId;
    const name = req.query.name;
    const surname = req.query.surname;

    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();

    const queryString = 'INSERT INTO public."User"("userId","name" ,"surname", "ts") VALUES ($1, $2, $3, $4) RETURNING "userId"';
    const queryValues = [deviceId, name, surname, ts];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res, next) {
    res.send('User put method called.');
});

router.delete('/', function (req, res, next) {
    res.send('User delete method called.');
});

module.exports = router;
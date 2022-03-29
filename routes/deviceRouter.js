const express = require('express');
const router = express.Router();
const db = require("../database")

router.get('/', async(req, res)=>{
    const queryString = 'SELECT * FROM "Device"';
    const {rows} = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async(req, res)=>{
    let queryString = 'SELECT * FROM "Device"';
    queryString += 'WHERE "deviceId"=' + req.params.id;
    const {rows} = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res)=>{
    const deviceId = req.query.deviceId;

    const queryString = 'INSERT INTO public."Device"("deviceId") VALUES ($1) RETURNING "deviceId"';
    const queryValues = [deviceId];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

module.exports = router;
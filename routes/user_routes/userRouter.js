const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "User"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "User"';
        queryString += 'WHERE "userId"=' + req.params.id;
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:name', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "User"';
        queryString += 'WHERE name=' + req.params.name;
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const name = req.query.name;
        const surname = req.query.surname;
        const email = req.query.email;
        const passcode = req.query.passcode;

        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();

        const queryString = 'INSERT INTO public."User"("userId","name" ,"surname", "ts", "email", "passcode") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "userId"';
        const queryValues = [userId, name, surname, ts, email, passcode];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
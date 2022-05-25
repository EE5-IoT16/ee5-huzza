var express = require('express');
var router = express.Router();
const db = require("../../database")

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "HeartPoints"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "HeartPoints"';
        queryString += 'WHERE "userId"=' + req.params.id;
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
const db = require("../../database")

router.get('/', async(req, res) => {
    const queryString = 'SELECT * FROM "HeartPoints"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async(req, res) => {
    let queryString = 'SELECT * FROM "HeartPoints"';
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

module.exports = router;

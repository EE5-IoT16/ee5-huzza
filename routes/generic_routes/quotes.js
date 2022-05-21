var express = require('express');
var router = express.Router();
const db = require("../../database")

router.get('/', async(req, res) => {
    const queryString = 'SELECT * FROM "Quotes"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res) => {
    const queryString = 'INSERT INTO public."Quotes"("quote")VALUES ($1) RETURNING "id"';
    const queryValues = [req.query.quote];
    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

module.exports = router;
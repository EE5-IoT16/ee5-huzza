var express = require('express');
var router = express.Router();
const db = require("../../database")

router.get('/', async(req, res) => {
    const queryString = 'SELECT * FROM "Quotes"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

module.exports = router;
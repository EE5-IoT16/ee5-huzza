const express = require('express');
const router = express.Router();
const db = require("../database")

router.get('/', async(req, res)=>{
    const queryString = 'SELECT * FROM "User"';
    const {rows} = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res)=>{
    const userId = req.query.userId;
    const name = req.query.name;
    const surname = req.query.surname;
    const email = req.query.email;
    const password = req.query.password;
    const salt = req.query.salt;

    const queryString = 'INSERT INTO public."User"("userId", "name", "surname", "email", "password", "salt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "userId"';
    const queryValues = [userId, name, surname, email, password, salt];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

module.exports = router;
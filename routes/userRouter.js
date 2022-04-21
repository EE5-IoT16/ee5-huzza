const express = require('express');
const router = express.Router();
const db = require("../database")

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "User"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:email', async (req, res) => {
    let queryString = 'SELECT * FROM "User"';
    queryString += ' WHERE email=\'' + req.params.email + "'";
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const userId = req.query.userId;
    const name = req.query.name;
    const surname = req.query.surname;
    const email = req.query.email;
    const password = req.query.password;
    const salt = req.query.salt;

    const queryString = 'INSERT INTO public."User"("userId", "name", "surname", "email", "password", "salt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "userId"';
    const queryValues = [userId, name, surname, email, password, salt];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', async (req, res) => {
    let userId, name, surname, email, password, salt;
    let queryValues = [];
    let parameterCounter = 1;
    let returnValue;
    if (req.query.userId) {
        userId = req.query.userId;
        let queryString = 'UPDATE public."User" SET ';
        if (req.query.name) {
            name = req.query.name;
            queryValues.push(name);
            queryString += "name = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.surname) {
            surname = req.query.surname;
            queryValues.push(surname);
            queryString += "surname = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.email) {
            email = req.query.email;
            queryValues.push(email);
            queryString += "email = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.password) {
            password = req.query.password;
            queryValues.push(password);
            queryString += "password = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.salt) {
            salt = req.query.salt;
            queryValues.push(salt);
            queryString += "salt = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (queryValues.length > 0) {
            queryString = queryString.replace(/,*$/, "");
            queryString += 'WHERE "userId" = $' + parameterCounter + ' RETURNING "userId"';
            queryValues.push(userId);

            const { response } = await db.query(queryString, queryValues);
            returnValue = response;
        }
        else{
            returnValue = "No value is changed.";
        }
    }
    else{
        returnValue = "userId is not provided.";
    }

    res.send(returnValue);
});

router.delete('/', function (req, res, next) {
    res.send('User delete method called.');
});

module.exports = router;
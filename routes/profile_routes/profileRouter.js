const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Profile"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:email', async (req, res) => {
    let queryString = 'SELECT * FROM "Profile"';
    queryString += ' WHERE email=\'' + req.params.email + "'";
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const profileId = req.query.profileId;
    const name = req.query.name;
    const surname = req.query.surname;
    const email = req.query.email;
    const password = req.query.password;
    const salt = req.query.salt;
    const defaultId = req.query.defaultId;

    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();

    const queryString = 'INSERT INTO public."Profile"("profileId", "name", "surname", "email", "password", "salt", "ts", "defaultId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING "profileId"';
    const queryValues = [profileId, name, surname, email, password, salt, ts, defaultId];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', async (req, res) => {
    let profileId, name, surname, email, password, salt;
    let queryValues = [];
    let parameterCounter = 1;
    let returnValue;
    if (req.query.profileId) {
        profileId = req.query.profileId;
        let queryString = 'UPDATE public."Profile" SET ';
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
            queryString += 'WHERE "profileId" = $' + parameterCounter + ' RETURNING "profileId"';
            queryValues.push(profileId);

            const { response } = await db.query(queryString, queryValues);
            returnValue = response;
        }
        else{
            returnValue = "No value is changed.";
        }
    }
    else{
        returnValue = "profileId is not provided.";
    }

    res.send(returnValue);
});

router.delete('/', function (req, res, next) {
    res.send('Profile delete method called.');
});

module.exports = router;
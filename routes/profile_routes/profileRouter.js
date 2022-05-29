const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "Profile"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:email', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "Profile"';
        queryString += ' WHERE email=\'' + req.params.email + "'";
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const name = req.query.name;
        const surname = req.query.surname;
        const email = req.query.email;
        const password = req.query.password;
        const salt = req.query.salt;
        const defaultId = req.query.defaultId;

        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();

        const queryString = 'INSERT INTO public."Profile"("name", "surname", "email", "password", "salt", "ts", "defaultId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING "profileId"';
        const queryValues = [name, surname, email, password, salt, ts, defaultId];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
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
            else {
                returnValue = {};
            }
        }
        else {
            returnValue = {};
        }

        res.send(returnValue);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
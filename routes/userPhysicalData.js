const express = require('express');
const router = express.Router();
const db = require("../database")

router.get('/', async(req, res)=>{
    const queryString = 'SELECT * FROM "UserPhysicalData"';
    const {rows} = await db.query(queryString);
    res.send(rows);
});

router.get('/:userId', async(req, res)=>{
    let queryString = 'SELECT * FROM "UserPhysicalData"';
    queryString += 'WHERE "userId"=' + req.params.userId;
    const {rows} = await db.query(queryString);
    res.send(rows);
});

router.post('/', async(req, res)=>{
    const userId = req.query.userId;
    const weight = req.query.weight;
    const height = req.query.height;
    const age = req.query.age;
    const gender = req.query.gender;

    const queryString = 'INSERT INTO public."UserPhysicalData"("userId", "weight", "height", "age", "gender") VALUES ($1, $2, $3, $4, $5) RETURNING "deviceId"';
    const queryValues = [userId, weight, height, age, gender];

    const {rows} = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', function (req, res) {
    let userId, weight, height, age, gender;
    let queryValues = [];
    let parameterCounter = 1;
    let returnValue;
    if (req.query.userId) {
        userId = req.query.userId;
        let queryString = 'UPDATE public."UserPhysicalData" SET ';
        if (req.query.weight) {
            weight = req.query.weight;
            queryValues.push(weight);
            queryString += "weight = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.height) {
            surname = req.query.height;
            queryValues.push(height);
            queryString += "height = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.age) {
            email = req.query.age;
            queryValues.push(age);
            queryString += "age = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.password) {
            password = req.query.gender;
            queryValues.push(gender);
            queryString += "gender = $" + parameterCounter + " ,";
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
    res.send('userPhysicalData delete method called.');
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require("../../database");
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "UserPhysicalData"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:userId', async (req, res) => {
    let queryString = 'SELECT * FROM "UserPhysicalData"';
    queryString += 'WHERE "userId"=' + req.params.userId;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    const userId = req.query.userId;
    let weight = req.query.weight;
    let height = req.query.height;
    weight = weight.toFixed(2);
    height = height.toFixed(2);

    const age = req.query.age;
    const gender = req.query.gender;

    let bmi = req.query.bmi;
    let rmr = req.query.rmr;
    bmi = bmi.toFixed(2);
    rmr = rmr.toFixed(2);

    let maxHeartRate = 205.8 - (0.685 * age);
    maxHeartRate = maxHeartRate.toFixed(2);

    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();

    const queryString = 'INSERT INTO public."UserPhysicalData"("userId", "weight", "height", "age", "gender", "bmi", "rmr", "ts", "maxHeartRate") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "userId"';
    const queryValues = [userId, weight, height, age, gender, bmi, rmr, ts, maxHeartRate];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', async (req, res) => {
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
            height = req.query.height;
            queryValues.push(height);
            queryString += "height = $" + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.age) {
            age = req.query.age;
            queryValues.push(age);
            queryString += "age = $" + parameterCounter + " ,";
            parameterCounter++;

            let maxHeartRate = 205.8 - (0.685 * age);
            maxHeartRate = maxHeartRate.toFixed(2);
            queryValues.push(maxHeartRate);
            queryString += '"maxHeartRate" = $' + parameterCounter + " ,";
            parameterCounter++;
        }

        if (req.query.password) {
            gender = req.query.gender;
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
        else {
            returnValue = "No value is changed.";
        }
    }
    else {
        returnValue = "userId is not provided.";
    }

    res.send(returnValue);
});

router.delete('/', function (req, res, next) {
    res.send('userPhysicalData delete method called.');
});

module.exports = router;
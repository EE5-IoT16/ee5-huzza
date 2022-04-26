var express = require('express');
var router = express.Router();
const db = require("../../database")
let RouterUtils = require("../route-utils");

router.get('/', async (req, res) => {
    const queryString = 'SELECT * FROM "Goals"';
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.get('/:id', async (req, res) => {
    let queryString = 'SELECT * FROM "Goals"';
    queryString += "WHERE userId=" + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

router.post('/', async (req, res) => {
    let routerUtils = new RouterUtils();
    const ts = routerUtils.getTimeStamp();
    const userId = req.query.userId;
    const dailySteps = req.query.dailySteps;
    const dailyHeartP = req.query.dailyHeartP;

    const queryString = 'INSERT INTO public."Goals"("userId","ts", "dailySteps", "dailyHeartPoints")VALUES ($1, $2, $3, $4) RETURNING "userId"';
    const queryValues = [userId, ts, dailySteps, dailyHeartP];

    const { rows } = await db.query(queryString, queryValues);
    res.send(rows);
});

router.put('/', async (req, res, next) => {
    let userId, dailySteps, dailyHeartP;
    let queryValues = [];
    let parameterCounter = 1;
    let returnValue;

    if (req.query.userId) {
        userId = req.query.userId;
        let queryString = 'UPDATE public."Goals" SET ';

        if (req.query.dailySteps) {
            dailySteps = req.query.dailySteps;
            queryValues.push(dailySteps);
            queryString += "dailySteps = $" + parameterCounter + " ,"
            parameterCounter++;
        }

        if (req.query.dailyHeartP) {
            dailyHeartP = req.query.dailyHeartP;
            queryValues.push(dailyHeartP);
            queryString += "dailyHeartPoints = $" + parameterCounter + " ,"
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
    res.send('Goals delete method called.');
});

module.exports = router;

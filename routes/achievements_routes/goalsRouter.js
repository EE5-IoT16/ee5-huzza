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
    queryString += 'WHERE "userId"=' + req.params.id;
    const { rows } = await db.query(queryString);
    res.send(rows);
});

/**
 * TO BE IMPLEMENTED
 * If there is already a record of the user then goals should just be updated.
 */
router.post('/', async (req, res, next) => {
    try {
        let routerUtils = new RouterUtils();
        const ts = routerUtils.getTimeStamp();
        const userId = req.query.userId;
        const dailySteps = req.query.dailySteps;
        const dailyHeartP = req.query.dailyHeartP;

        const queryString = 'INSERT INTO public."Goals"("userId","ts", "dailySteps", "dailyHeartPoints")VALUES ($1, $2, $3, $4) RETURNING "userId"';
        const queryValues = [userId, ts, dailySteps, dailyHeartP];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.put('/', async (req, res, next) => {
    try {
        let userId, dailySteps, dailyHeartP;
        let queryValues = [];
        let parameterCounter = 1;
        let returnValue;

        if (req.query.userId) {
            userId = req.query.userId;

            let queryString = 'SELECT * FROM "Goals" WHERE "userId"=' + req.query.userId;
            const { rows } = await db.query(queryString);

            if (rows.length > 0) {

                queryString = 'UPDATE public."Goals" SET ';

                if (req.query.dailySteps) {
                    dailySteps = req.query.dailySteps;
                    queryValues.push(dailySteps);
                    queryString += '"dailySteps" = $' + parameterCounter + " ,"
                    parameterCounter++;
                }

                if (req.query.dailyHeartP) {
                    dailyHeartP = req.query.dailyHeartP;
                    queryValues.push(dailyHeartP);
                    queryString += '"dailyHeartPoints" = $' + parameterCounter + " ,"
                    parameterCounter++;
                }

                if (queryValues.length > 0) {
                    queryString = queryString.replace(/,*$/, "");
                    queryString += 'WHERE "userId" = $' + parameterCounter + ' RETURNING "userId"';
                    queryValues.push(userId);

                    const { response } = await db.query(queryString, queryValues);
                    returnValue = response;
                }
            }
            else {
                let routerUtils = new RouterUtils();
                const ts = routerUtils.getTimeStamp();                
                userId = req.query.userId;
                dailySteps = req.query.dailySteps;
                dailyHeartP = req.query.dailyHeartP;

                queryString = 'INSERT INTO public."Goals"("userId","ts", "dailySteps", "dailyHeartPoints")VALUES ($1, $2, $3, $4) RETURNING "userId"';
                queryValues = [userId, ts, dailySteps, dailyHeartP];

                returnValue = await db.query(queryString, queryValues);
                returnValue = returnValue.rows;
            }
        }
        else {
            returnValue = [];
        }

        res.send(returnValue);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;

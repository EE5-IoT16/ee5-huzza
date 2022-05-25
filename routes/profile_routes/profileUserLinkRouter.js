const express = require('express');
const router = express.Router();
const db = require("../../database");

router.get('/', async (req, res, next) => {
    try {
        const queryString = 'SELECT * FROM "ProfileUserLink"';
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.get('/:profileId', async (req, res, next) => {
    try {
        let queryString = 'SELECT * FROM "ProfileUserLink"';
        queryString += ' WHERE "profileId"=\'' + req.params.profileId + "'";
        const { rows } = await db.query(queryString);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const profileId = req.query.profileId;
        const userId = req.query.userId;
        const viewOnly = req.query.viewOnly;

        const queryString = 'INSERT INTO public."ProfileUserLink"("profileId", "userId", "viewOnly") SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT * FROM public."ProfileUserLink" WHERE "profileId"=$1 AND "userId"=$2) RETURNING "profileId"';
        const queryValues = [profileId, userId, viewOnly];

        const { rows } = await db.query(queryString, queryValues);
        res.send(rows);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
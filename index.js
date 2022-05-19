const app = require('./app');
const cron = require('node-cron');
let RouterUtils = require('./routes/route-utils');
let routerUtils = new RouterUtils();

// In the future can be get as a parameter from the command line
const port = 3000;

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`);
});

cron.schedule('0 0 22 * * *', async () => {
    console.log("Adding Empty Steps Everyday at 23:00 " + new Date());
    await routerUtils.postEmptySteps();
    await routerUtils.postEmptyHeartPoints();
    await routerUtils.postEmptyGoalsCompleted();
});
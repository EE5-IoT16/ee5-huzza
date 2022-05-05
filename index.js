const app = require('./app');

// In the future can be get as a parameter from the command line
const port = 3000;

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}`);
});
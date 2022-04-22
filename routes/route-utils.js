module.exports = routeUtils = (() => {
    function routeUtils() { };

    routeUtils.prototype.getTimeStamp = function () {
        let date = new Date();
        let ts = "";

        ts += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " ";
        ts += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return ts;
    };

    routeUtils.prototype.getDayRange = function () {
        let date = new Date();
        let ts = { start: "", end: "" };

        ts.start += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

        let tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        ts.end += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    routeUtils.prototype.getWeekRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

        let tomorrow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    routeUtils.prototype.getMonthRange = function () {
        let date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        let ts = { start: "", end: "" };

        ts.end += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();        

        let tomorrow = new Date(Date.now() - date.getUTCDate() * 24 * 60 * 60 * 1000);
        ts.start += tomorrow.getUTCFullYear() + "-" + (tomorrow.getUTCMonth() + 1) + "-" + tomorrow.getUTCDate();

        return ts;
    };

    return routeUtils;
})();
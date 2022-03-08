module.exports = routeUtils = (() => {
    function routeUtils(){};

    routeUtils.prototype.getTimeStamp = function(){
        let date =  new Date();
        let ts = "";

        ts += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " ";
        ts += date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return ts;
    };

    return routeUtils;
})();
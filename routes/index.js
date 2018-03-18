module.exports.doRoute = function (app) {
    app.use('/', require('./r_system'));
    app.use('/', require('./r_biz_relic'));
};

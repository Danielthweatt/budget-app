const debug = require('debug')('app:boot');
const router = require('../routes');
const routeNotFound = require('../middleware/routeNotFound');
const error = require('../middleware/error');

module.exports = app => {
    //Routes
    app.use(router);
    app.use(routeNotFound);

    debug('Routes registered...');

    //Express error handling
    app.use(error);

    debug('Express error handler registered...');
};
const debug = require('debug')('app:boot');
const router = require('../routes');
const notFound = require('../middleware/notFound');
const error = require('../middleware/error');

module.exports = app => {
    //Routes
    app.use(router);
    app.use(notFound);

    debug('Routes registered...');

    //Express error handling
    app.use(error);

    debug('Express error handler registered...');
};
const debug = require('debug')('app:routeNotFoundMiddleware');

module.exports = function(req, res, next) {
    debug('Route not found...');

    return res.status(404).send('Not found.');
};
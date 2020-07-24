const debug = require('debug')('app:routeNotFoundMiddleware');

module.exports = (req, res, next) => {
    debug('Route not found...');
    debug('Sending 404 response...');

    res.status(404).send('Not found.');
};
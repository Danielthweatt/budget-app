const winston = require('winston');
const debug = require('debug')('app:routeNotFoundMiddleware');

module.exports = (req, res, next) => {
    debug('Route not found...');
    debug('Logging error...');

    winston.error(`404 - Not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    debug('Sending 404 response...');

    res.status(404).render('404', { 
        title: '404',
        user: req.session.user
    });
};
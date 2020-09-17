const config = require('config');
const winston = require('winston');
const debug = require('debug')('app:routeNotFoundMiddleware');

const message = config.get('404Message');

module.exports = (req, res, next) => {
    debug('Route not found...');
    debug('Logging error...');

    winston.error(`404 - Not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    debug('Sending 404 response...');

    if (req.originalUrl.match(/^\/api/)) {
        return res.status(404).send({
            error: {
                details: [{
                    message
                }]
            }
        });
    }

    res.status(404).render('404', { 
        title: '404',
        user: req.session.user,
        message
    });
};
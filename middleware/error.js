const winston = require('winston');
const debug = require('debug')('app:errorMiddleware');

module.exports = (err, req, res, next) => {
    debug(err);
    debug('Logging error...');

    winston.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });

    debug('Sending 500 response...');

    res.status(500).render('500', { 
        title: '500',
        user: req.session.user
    });
};
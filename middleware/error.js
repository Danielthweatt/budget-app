const config = require('config');
const winston = require('winston');
const debug = require('debug')('app:errorMiddleware');

const message = config.get('500Message');

module.exports = (err, req, res, next) => {
    debug(err);
    debug('Logging error...');

    winston.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, { stack: err.stack });

    debug('Sending 500 response...');

    if (req.originalUrl.match(/^\/api/)) {
        return res.status(500).send({
            error: {
                details: [{
                    message
                }]
            }
        });
    }

    res.status(500).render('500', { 
        title: '500',
        user: req.session.user,
        message
    });
};
const winston = require('winston');
const debug = require('debug')('app:errorMiddleware');

module.exports = (err, req, res, next) => {
    debug(err);
    debug('Logging error...');

    winston.error(err.message, err);

    debug('Sending 500 response...');

    res.status(500).render('500');
};
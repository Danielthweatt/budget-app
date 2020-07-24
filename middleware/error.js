const debug = require('debug')('app:errorMiddleware');

module.exports = (err, req, res, next) => {
    debug(err);
    debug('Logging error...');

    //TODO: Implement error logging

    debug('Sending 500 response...');

    res.status(500).send('Something failed.');
};
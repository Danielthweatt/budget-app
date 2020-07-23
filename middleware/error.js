const debug = require('debug')('app:errorMiddleware');

module.exports = function(err, req, res, next) {
    debug(err);
    debug('Logging error...');

    //TODO: Implement error logging

    return res.status(500).send('Something failed.');
};
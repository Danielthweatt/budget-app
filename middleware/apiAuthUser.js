const debug = require('debug')('app:apiAuthUserMiddleware');

module.exports = (req, res, next) => {
    debug('Checking if user is logged in...');

    if (!req.session.user) {
        debug('User is not logged in...');

        return res.status(401).send({
            error: {
                details: [{
                    message: 'Access denied. User not authenticated.'
                }]
            }
        });
    }

    debug('User is logged in...');

    next();
};
const debug = require('debug')('app:authUserMiddleware');

module.exports = (req, res, next) => {
    debug('Checking if user is logged in...');

    if (!req.session.user) {
        debug('User is not logged in...');
        
        if (req.originalUrl.match(/^\/api/)) {
            return res.status(401).send({
                error: {
                    details: [{
                        message: 'Access denied. User not authenticated.'
                    }]
                }
            });
        }

        debug('Redirecting to login form...');

        return res.redirect('/login');
    }

    debug('User is logged in...');

    next();
};
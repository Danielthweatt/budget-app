const debug = require('debug')('app:authMiddleware');

module.exports = function(req, res, next) {
    debug('Checking if user is logged in...');

    if (!req.session.user) {
        debug('User is not logged in...');
        debug('Redirecting to login form...');

        return res.redirect('/login');
    }

    debug('User is logged in...');

    next();
};
const debug = require('debug')('app:authGuestMiddleware');

module.exports = (req, res, next) => {
    debug('Checking if user is guest...');

    if (req.session.user) {
        debug('User is logged in...');
        debug('Redirecting to dashboard...');

        return res.redirect('/dashboard');
    }

    debug('User is guest...');

    next();
};
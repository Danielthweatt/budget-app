const debug = require('debug')('app:sessionMiddleware');

module.exports = (req, res, next) => {
    debug('Processing session flash data...');
    
    //Read and remove flash data from session
    res.locals.flash = req.session.flash || {};
    req.session.flash = {};

    debug('Session flash data processed...');

    next();
};
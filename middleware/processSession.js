module.exports = function(req, res, next) {
    //Read and remove flash data from session
    res.locals.flash = req.session.flash || {};
    req.session.flash = {};
    
    next();
};
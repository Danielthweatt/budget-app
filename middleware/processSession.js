module.exports = function(req, res, next) {
    //Set flash data
    req.flash = {};
    
    for (const name in req.session.flash) {
        req.flash[name] = req.session.flash[name]; 
    }

    //Remove flash data from session
    req.session.flash = {};

    next();
};
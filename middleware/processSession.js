module.exports = function(req, res, next) {
    //Read and remove flash data from session
    const { flash } = req.session;
    delete req.session.flash;
    
    //Flash data getter
    req.getFlashData = function(key) {
        if (flash) {
            return flash[key] || null;
        }
        
        return null;
    }

    //Flash data setter
    req.setFlashData = function(key, value) {
        if (!this.session.flash) {
            this.session.flash = {};
        }

        this.session.flash[key] = value;
    }

    next();
};
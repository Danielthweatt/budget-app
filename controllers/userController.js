const debug = require('debug')('app:userController');

module.exports = {
    home(req, res) {
        debug('home()');

        debug('Rendering home view...');
        res.render('home', { 
            mainHeading: 'Budget App' 
        });
    }
};
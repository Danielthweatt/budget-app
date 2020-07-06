const debug = require('debug')('app:userController');

module.exports = {
    getLoginForm(req, res) {
        debug('getLoginForm()');

        debug('Rendering login form view...');
        res.render('login-form', { title: 'Login' });
    },
    getHome(req, res) {
        debug('getHome()');

        const user = { name: 'John Smith' };

        debug('Rendering home view...');
        res.render('home', { 
            title: 'Home',
            user
        });
    }
};
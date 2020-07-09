const debug = require('debug')('app:userController');

module.exports = {
    getHome(req, res) {
        debug('getHome()');

        debug('Rendering home view...');
        res.render('home', { title: 'Home' });
    },
    getSignUpForm(req, res) {
        debug('getSignUpForm()');

        debug('Rendering sign up form view...');
        res.render('sign-up-form', { title: 'Sign Up' });
    },
    postSignUpForm(req, res) {
        debug('postSignUpForm()');

    },
    getLoginForm(req, res) {
        debug('getLoginForm()');

        debug('Rendering login form view...');
        res.render('login-form', { title: 'Login' });
    },
    getDashboard(req, res) {
        debug('getDashboard()');

        const user = { name: 'John Smith' };

        debug('Rendering dashboard view...');
        res.render('dashboard', { 
            title: 'Dashboard',
            user
        });
    },
    getLogout(req, res) {
        debug('getLogout()');

        debug('Redirecting to home...');
        res.redirect('/');
    },
};
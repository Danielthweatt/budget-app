const Joi = require('@hapi/joi');
const debug = require('debug')('app:userController');

function validateNewUser(newUser) {
    const newUserSchema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email({ minDomainSegments: 2 }),
        password: Joi.string().min(5).max(255).required(),
        confirmPassword: Joi.ref('password')
    }).with('password', 'confirmPassword');

    return newUserSchema.validate(newUser);
}

module.exports = {
    getHome(req, res) {
        debug('getHome()');

        debug('Rendering home view...');

        return res.render('home', { title: 'Home' });
    },
    getSignUpForm(req, res) {
        debug('getSignUpForm()');

        debug('Rendering sign up form view...');

        return res.render('sign-up-form', { title: 'Sign Up' });
    },
    async postSignUpForm(req, res) {
        debug('postSignUpForm()');
        debug('Validating user...');
        
        const { error } = await validateNewUser(req.body);

        if (error) {
            debug('Validation error...');
            debug(error.details[0].message);
            debug('Redirecting to sign-up form...');

            return res.redirect('/sign-up');
        }

        debug('User signed up succesfully...');
        debug('Redirecting to login form...');

        return res.rediect('/login');
    },
    getLoginForm(req, res) {
        debug('getLoginForm()');

        debug('Rendering login form view...');

        return res.render('login-form', { title: 'Login' });
    },
    getDashboard(req, res) {
        debug('getDashboard()');

        const user = { name: 'John Smith' };

        debug('Rendering dashboard view...');

        return res.render('dashboard', { 
            title: 'Dashboard',
            user
        });
    },
    getLogout(req, res) {
        debug('getLogout()');

        debug('Redirecting to home...');
        
        return res.redirect('/');
    },
};
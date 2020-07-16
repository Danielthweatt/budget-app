const { User } = require('../models');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
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

        const { body } = req;

        debug('Validating user...');
        
        const { error } = await validateNewUser(body);

        if (error) {
            debug('Validation error...');

            error.details.forEach(({ message }) => debug(message));

            debug('Redirecting to sign-up form...');

            return res.redirect('/sign-up');
        }

        const { username, email, password } = body;
        let user = await User.findOne({ username });

        if (user) {
            debug('User already exists...');
            debug('Redirecting to sign-up form...');

            return res.redirect('/sign-up');
        }

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        debug('User signed up succesfully...');
        debug('Redirecting to login form...');

        return res.redirect('/login');
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
            testUser
        });
    },
    getLogout(req, res) {
        debug('getLogout()');

        debug('Redirecting to home...');

        return res.redirect('/');
    },
};
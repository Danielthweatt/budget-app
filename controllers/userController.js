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

    return newUserSchema.validate(newUser, { abortEarly: false });
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

        return res.render('sign-up-form', { 
            title: 'Sign Up',
            formSubmissionError: res.locals.flash.formSubmissionError || null
        });
    },
    async postSignUpForm(req, res) {
        debug('postSignUpForm()');

        const { body } = req;

        debug('Validating sign-up form input...');
        
        const { error } = await validateNewUser(body);

        if (error) {
            debug('Validation errors:');

            error.details.forEach(({ message }) => debug(message));

            debug('Redirecting to sign-up form...');
            
            req.session.flash.formSubmissionError = error;

            return res.redirect('/sign-up');
        }

        const { username, email, password } = body;
        let user = await User.findOne({ username });

        if (user) {
            debug('User already exists...');
            debug('Redirecting to sign-up form...');

            req.session.flash.formSubmissionError = {
                details: [
                    {
                        message: "There is already a user by that username."
                    }
                ]
            };

            return res.redirect('/sign-up');
        }

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();

        req.session.user = {
            _id: user._id,
            username
        };

        debug('User signed up succesfully...');
        debug('Redirecting to dashboard...');

        return res.redirect('/dashboard');
    },
    getLoginForm(req, res) {
        debug('getLoginForm()');

        debug('Rendering login form view...');

        return res.render('login-form', { title: 'Login' });
    },
    getDashboard(req, res) {
        debug('getDashboard()');
        debug('Rendering dashboard view...');

        return res.render('dashboard', { 
            title: 'Dashboard',
            user: req.session.user
        });
    },
    getLogout(req, res) {
        debug('getLogout()');
        debug('Logging user out...');

        delete req.session.user;

        debug('Redirecting to home...');

        return res.redirect('/');
    },
};
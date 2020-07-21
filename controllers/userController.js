const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:userController');
const { User } = require('../models');

function validateSignUpFormInput(signUpFormInput) {
    const signUpFormInputSchema = Joi.object({
        username: Joi.string()
                        .min(3)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'Username must be text.',
                            'string.empty': 'Must have a username.',
                            'string.min': 'Username must be at least 3 characters long.',
                            'string.max': 'Username must be at most 50 characters long.',
                            'any.required': 'Must have a username.'
                        }),
        email: Joi.string()
                    .email({ minDomainSegments: 2 })
                    .required()
                    .messages({
                        'string.base': 'Email address must be text.',
                        'string.empty': 'Must have an email address.',
                        'string.email': 'Email address must be a valid email address.',
                        'any.required': 'Must have an email address.'
                    }),
        password: Joi.string()
                        .min(8)
                        .max(50)
                        .required()
                        .messages({
                            'string.base': 'Password must be text.',
                            'string.empty': 'Must have a password.',
                            'string.min': 'Password must be at least 8 characters long.',
                            'string.max': 'Password must be at most 50 characters long.',
                            'any.required': 'Must have a password.'
                        }),
        confirmPassword: Joi.ref('password')
    }).with('password', 'confirmPassword').messages({
        'any.only': 'Confirm Password must be the same as Password.'
    });

    return signUpFormInputSchema.validate(signUpFormInput, { abortEarly: false });
}

module.exports = {
    getHome(req, res) {
        debug('getHome()');
        debug('Rendering home view...');

        return res.render('home', { 
            title: 'Home',
            user: req.session.user
        });
    },
    getSignUpForm(req, res) {
        debug('getSignUpForm()');
        
        const { formSubmissionError, signUpFormInput } = res.locals.flash;

        debug('Rendering sign up form view...');

        return res.render('sign-up-form', { 
            title: 'Sign Up',
            formSubmissionError: formSubmissionError || null,
            signUpFormInput: signUpFormInput || {}
        });
    },
    async postSignUpForm(req, res) {
        debug('postSignUpForm()');

        const { body } = req;
        const { username, email, password } = body;

        debug('Validating sign-up form input...');
        
        const { error } = await validateSignUpFormInput(body);

        if (error) {
            debug('Validation errors:');

            error.details.forEach(({ message }) => debug(message));

            debug('Redirecting to sign-up form...');
            
            req.session.flash.formSubmissionError = error;
            req.session.flash.signUpFormInput = {
                username,
                email
            };

            return res.redirect('/sign-up');
        }

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

        debug('Sign-up form input valid...');
        debug('Creating user...');

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();

        debug('User created succesfully...');
        debug('Logging user in and regenerating session...');

        req.session.regenerate(function(err) {
            if (err) {
                debug('Error regenerating session:');
                debug(err);

                //TODO rework this when error handling is implemented
                return res.status(500).send();
            }

            req.session.user = {
                _id: user._id,
                username
            };
    
            debug('User logged in and session regenerated...');
            debug('Redirecting to dashboard...');
    
            return res.redirect('/dashboard');
        });
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
        debug('Logging user out and destroying session...');

        req.session.destroy(function(err) {
            if (err) {
                debug('Error destroying session:');
                debug(err);

                //TODO rework this when error handling is implemented
                return res.status(500).send();
            }

            debug('User logged out and session destroyed...');
            debug('Redirecting to home...');

            return res.redirect('/');
        });
    },
};
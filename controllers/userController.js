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
                        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/)
                        .required()
                        .messages({
                            'string.base': 'Password must be text.',
                            'string.empty': 'Must have a password.',
                            'string.min': 'Password must be at least 8 characters long.',
                            'string.max': 'Password must be at most 50 characters long.',
                            'string.pattern.base': 'Password must include a lowercase letter, an uppercase letter, and a number.',
                            'any.required': 'Must have a password.'
                        }),
        confirmPassword: Joi.ref('password')
    }).with('password', 'confirmPassword').messages({
        'any.only': 'Confirm Password must be the same as Password.'
    });

    return signUpFormInputSchema.validate(signUpFormInput, { abortEarly: false });
}

function validateLoginFormInput(loginFormInput) {
    const loginFormInputSchema = Joi.object({
        username: Joi.string()
                        .required()
                        .messages({
                            'string.base': 'Username must be text.',
                            'string.empty': 'Must enter a username.',
                            'any.required': 'Must enter a username.'
                        }),
        password: Joi.string()
                        .required()
                        .messages({
                            'string.base': 'Password must be text.',
                            'string.empty': 'Must enter a password.',
                            'any.required': 'Must enter a password.'
                        })
    });

    return loginFormInputSchema.validate(loginFormInput, { abortEarly: false });
}

module.exports = {
    getHome(req, res) {
        debug('getHome()');
        debug('Rendering home view...');

        res.render('home', { 
            title: 'Home',
            user: req.session.user
        });
    },
    getSignUpForm(req, res) {
        debug('getSignUpForm()');

        const { formSubmissionError, signUpFormInput } = res.locals.flash;

        debug('Rendering sign up form view...');

        res.render('sign-up-form', { 
            title: 'Sign Up',
            formSubmissionError: formSubmissionError || null,
            signUpFormInput: signUpFormInput || {}
        });
    },
    async postSignUpForm(req, res, next) {
        debug('postSignUpForm()');

        const { body } = req;
        const { username, email, password } = body;

        debug('Validating sign-up form input...');
        
        const { error } = await validateSignUpFormInput(body);

        if (error) {
            debug('Validation errors:');

            error.details.forEach(({ message }) => debug(` ${message}`));

            debug('Redirecting to sign-up form...');
            
            req.session.flash.formSubmissionError = error;
            req.session.flash.signUpFormInput = {
                username,
                email
            };

            return res.redirect('/sign-up');
        }

        debug('Sign-up form input valid...');

        let user = await User.findOne({ username });

        if (user) {
            debug('User already exists...');
            debug('Redirecting to sign-up form...');

            req.session.flash.formSubmissionError = {
                details: [
                    {
                        message: "User already exists."
                    }
                ]
            };

            return res.redirect('/sign-up');
        }

        debug('User does not already exist...');
        debug('Creating user...');

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();

        debug('User created succesfully...');
        debug('Logging user in and regenerating session...');

        req.session.regenerate(err => {
            if (err) {
                return next(err);
            }

            req.session.user = {
                _id: user._id,
                username: user.username
            };
    
            debug('User logged in and session regenerated...');
            debug('Redirecting to dashboard...');
    
            res.redirect('/dashboard');
        });
    },
    getLoginForm(req, res) {
        debug('getLoginForm()');

        const { formSubmissionError, loginFormInput } = res.locals.flash;

        debug('Rendering login form view...');

        res.render('login-form', { 
            title: 'Login',
            formSubmissionError: formSubmissionError || null,
            loginFormInput: loginFormInput || {}
        });
    },
    async postLoginForm(req, res, next) {
        debug('postLoginForm()');

        const { body } = req;
        const { username } = body;

        debug('Validating login form input...');
        
        const { error } = await validateLoginFormInput(body);

        if (error) {
            debug('Validation errors:');

            error.details.forEach(({ message }) => debug(` ${message}`));

            debug('Redirecting to login form...');
            
            req.session.flash.formSubmissionError = error;
            req.session.flash.loginFormInput = { username };

            return res.redirect('/login');
        }

        debug('Login form input valid...');
        debug('Checking if user exists...');

        let user = await User.findOne({ username });

        if (!user) {
            debug('User does not exist...');
            debug('Redirecting to login form...');

            req.session.flash.formSubmissionError = {
                details: [
                    {
                        message: "Login credentials invalid."
                    }
                ]
            };

            return res.redirect('/login');
        }

        debug('User exists...');
        debug('Authenticating password...');

        const passwordAuthenticated = await bcrypt.compare(body.password, user.password);

        if (!passwordAuthenticated) {
            debug('Password not authenticated...');
            debug('Redirecting to login form...');

            req.session.flash.formSubmissionError = {
                details: [
                    {
                        message: "Login credentials invalid."
                    }
                ]
            };

            return res.redirect('/login');
        }

        debug('Password authenticated...');
        debug('Logging user in and regenerating session...');

        req.session.regenerate(err => {
            if (err) {
                return next(err);
            }

            req.session.user = {
                _id: user._id,
                username: user.username
            };
    
            debug('User logged in and session regenerated...');
            debug('Redirecting to dashboard...');
    
            res.redirect('/dashboard');
        });
    },
    getDashboard(req, res) {
        debug('getDashboard()');
        debug('Rendering dashboard view...');

        res.render('dashboard', { 
            title: 'Dashboard',
            user: req.session.user
        });
    },
    postLogout(req, res, next) {
        debug('postLogout()');
        debug('Logging user out and destroying session...');

        req.session.destroy(err => {
            if (err) {
                return next(err);
            }

            debug('User logged out and session destroyed...');
            debug('Redirecting to home...');

            res.redirect('/');
        });
    }
};
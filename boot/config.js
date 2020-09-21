const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const config = require('config');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const debug = require('debug')('app:boot');
const sessionMiddleware = require('../middleware/session');
const util = require('../util');

module.exports = app => {
    //Middleware
    //TODO: Check these default cookie attributes again and re-evaluate
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));
    //Session Management
    app.use(session({
        secret: config.get('session.secret'),
        name: "budget-app",
        //TODO: Come back to these cookie attributes and re-evaluate
        cookie: {
            path: '/',
            httpOnly: true,
            sameSite: true,
            secure: false,
            maxAge: 600000
        },
        resave: false,
        saveUninitialized: false
        //TODO: Set session store
    }));
    app.use(sessionMiddleware);
    
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
    
        debug('Morgan enabled...');
    }

    debug('Middleware registered...');
    
    //Template Engine
    app.engine('handlebars', exphbs({
        helpers: {
            json(obj) {
                return JSON.stringify(obj);
            },
            USD(amount) {
                return util.formatUSDCurrency(amount);
            }
        }
    }));
    app.set('view engine', 'handlebars')
    
    debug('Template engine configured...');
};
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:boot');
const exphbs = require('express-handlebars');
const sessionMiddleware = require('./middleware/session');
const router = require('./routes');
const routeNotFound = require('./middleware/routeNotFound');
const error = require('./middleware/error');

process.on('uncaughtException', err => {
    debug(err);
    debug('Logging error...');

    //TODO: Implement error logging

    process.exit(1);
});

process.on('unhandledRejection', err => {
    debug(err);
    debug('Logging error...');

    //TODO: Implement error logging

    process.exit(1);
});

//Express App
const PORT = process.env.PORT || config.get('expressConfig.port');
const app = express();

debug('Express app generated...');

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || `mongodb://${config.get('dbConfig.host')}/${config.get('dbConfig.dbName')}`).then(() => {
    debug('Connected to MongoDB...');
}).catch(err => {
    debug('Could not connect to MongoDB...');
    debug(err);
});

//Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//Session Management
app.use(session({
    secret: config.get('sessionConfig.secret'),
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

if (app.get('env') !== 'production') {
    app.use(morgan('tiny'));

    debug('Morgan enabled...');
}

debug('Middleware registered...');

//Template Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')

debug('Template engine configured...');

//Routes
app.use(router);
app.use(routeNotFound);

debug('Routes registered...');

//Express error handling
app.use(error);

debug('Express error handling registered...');

//Start
app.listen(PORT, () => {
    debug(`Listening on Port ${PORT}...`);
});
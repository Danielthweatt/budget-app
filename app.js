const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:boot');
const exphbs = require('express-handlebars');
const processSession = require('./middleware/processSession');
const router = require('./routes');

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
app.use(processSession);

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

debug('Routes registered...');

//Start
app.listen(PORT, () => {
    debug(`Listening on Port ${PORT}...`);
});
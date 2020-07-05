const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:boot');
const router = require('./routes');

//Express App
const PORT = process.env.PORT || 3000;
const app = express();

debug('Express app generated...');

//MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/budget_app').then(() => {
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
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const debug = require('debug')('app:boot');

//Express app
const app = express();
debug('Express app generated...');

//Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Morgan enabled...');
}

debug('Middleware registered...');

//Route
const router = require('./routes');
app.use(router);
debug('Routes registered...');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug(`Listening on Port ${port}...`);
});
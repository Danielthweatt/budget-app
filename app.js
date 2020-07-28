require('./boot/log')();

const express = require('express');
const config = require('config');
const debug = require('debug')('app:boot');

//Express App
const PORT = config.get('server.port');
const app = express();

debug('Express app generated...');

require('./boot/config')(app);
require('./boot/db')();
require('./boot/routes')(app);

//Start
app.listen(PORT, () => debug(`Listening on Port ${PORT}...`));
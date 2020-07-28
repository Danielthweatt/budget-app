const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:boot');

module.exports = () => {
    //MongoDB Connection
    mongoose.connect(config.get('db.uri')).then(() => debug('Connected to MongoDB...'));
};
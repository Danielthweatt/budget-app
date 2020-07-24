const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:boot');

module.exports = () => {
    //MongoDB Connection
    mongoose.connect(
        process.env.MONGODB_URI || 
        `mongodb://${config.get('dbConfig.host')}/${config.get('dbConfig.dbName')}`
    ).then(() => debug('Connected to MongoDB...'));
};
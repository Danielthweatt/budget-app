const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:boot');

module.exports = async () => {
    //MongoDB Connection
    await mongoose.connect(config.get('db.uri'), { 
        useNewUrlParser: true, 
        useCreateIndex: true,
        useUnifiedTopology:true 
    });

    debug('Connected to MongoDB...');
};
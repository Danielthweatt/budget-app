const winston = require('winston');
const debugAppBoot = require('debug')('app:boot');
const debugAppError = require('debug')('app:error');

module.exports = () => {
    //Configure logger (default winston logger)
    winston.add(new winston.transports.File({ filename: './logs/error.log', level: 'error' }));
    winston.add(new winston.transports.File({ filename: './logs/combined.log' }));

    debugAppBoot('Logger configured...');

    //Error handling
    process.on('uncaughtException', err => {
        debugAppError(err);
        debugAppError('Logging error...');
    
        winston.error(err.message, { stack: err.stack });
    
        process.exit(1);
    });
    
    process.on('unhandledRejection', err => {
        throw err;
    });

    debugAppBoot('Error handlers configured...');
};
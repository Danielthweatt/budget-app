const debugAppBoot = require('debug')('app:boot');
const debugAppError = require('debug')('app:error');

module.exports = () => {
    //Error handling
    process.on('uncaughtException', err => {
        debugAppError(err);
        debugAppError('Logging error...');
    
        //TODO: Implement error logging
    
        process.exit(1);
    });
    
    process.on('unhandledRejection', err => {
        debugAppError(err);
        debugAppError('Logging error...');
    
        //TODO: Implement error logging
    
        process.exit(1);
    });

    debugAppBoot('Error handling configured...');
};
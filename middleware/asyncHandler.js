const debug = require('debug')('app:asyncHandlerMiddleware');

module.exports = asyncHandler => {
    return async (req, res, next) => {
        try {
            await asyncHandler(req, res, next);
        } catch(err) {
            debug('Passing caught error to error middleware...');
            next(err);
        }
    };
};
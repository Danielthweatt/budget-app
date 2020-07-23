const debug = require('debug')('app:asyncHandlerMiddleware');

module.exports = function(asyncHandler) {
    return async function(req, res, next) {
        try {
            await asyncHandler(req, res, next);
        } catch(err) {
            next(err);
        }
    };
};
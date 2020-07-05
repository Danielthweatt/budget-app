const router = require('express').Router();
const apiRouter = require('./api');

//API routes
router.use('/api', apiRouter);

module.exports = router;
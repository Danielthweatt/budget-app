const router = require('express').Router();
const webRouter = require('./web');
const apiRouter = require('./api');

//Web Routes
router.use(webRouter);

//API Routes
router.use('/api', apiRouter);

module.exports = router;
const router = require('express').Router();
const mainRouter = require('./main');
const apiRouter = require('./api');

//Main Routes
router.use(mainRouter);

//API Routes
router.use('/api', apiRouter);

module.exports = router;
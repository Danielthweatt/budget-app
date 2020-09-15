const router = require('express').Router();
const budgetRouter = require('./budget');

router.use('/budget', budgetRouter);

module.exports = router;
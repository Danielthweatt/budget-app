const router = require('express').Router();
const userRouter = require('./user');
const budgetRouter = require('./budget');

router.use(userRouter);
router.use(budgetRouter);

module.exports = router;
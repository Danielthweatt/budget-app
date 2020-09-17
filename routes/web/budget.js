const router = require('express').Router();
const authUser = require('../../middleware/authUser');
const asyncHandler = require('../../middleware/asyncHandler');
const budgetController = require('../../controllers/web/budgetController');

router.get('/manage-budget/:_id', authUser, asyncHandler(budgetController.getManageBudget));

module.exports = router;
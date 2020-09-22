const router = require('express').Router();
const authUser = require('../../middleware/authUser');
const asyncHandler = require('../../middleware/asyncHandler');
const budgetController = require('../../controllers/api/budgetController');

router.post('/', authUser, asyncHandler(budgetController.postBudget));

module.exports = router;
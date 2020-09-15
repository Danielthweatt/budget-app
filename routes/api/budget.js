const router = require('express').Router();
const apiAuthUser = require('../../middleware/apiAuthUser');
const asyncHandler = require('../../middleware/asyncHandler');
const budgetController = require('../../controllers/api/budgetController');

router.post('/', apiAuthUser, asyncHandler(budgetController.postBudget));

module.exports = router;
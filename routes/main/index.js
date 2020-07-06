const router = require('express').Router();
const userController = require('../../controllers/userController');

router.get('/', userController.getHome);
router.get('/login', userController.getLoginForm);

module.exports = router;
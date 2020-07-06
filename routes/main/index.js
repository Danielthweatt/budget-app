const router = require('express').Router();
const userController = require('../../controllers/userController');

router.get('/', userController.getHome);
router.get('/login', userController.getLoginForm);
router.get('/dashboard', userController.getDashboard);
router.get('/logout', userController.getLogout);

module.exports = router;
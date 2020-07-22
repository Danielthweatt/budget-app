const router = require('express').Router();
const auth = require('../../middleware/auth');
const userController = require('../../controllers/userController');

router.get('/', userController.getHome);
router.get('/sign-up', userController.getSignUpForm);
router.post('/sign-up', userController.postSignUpForm);
router.get('/login', userController.getLoginForm);
router.post('/login', userController.postLoginForm);
router.get('/dashboard', auth, userController.getDashboard);
router.get('/logout', auth, userController.getLogout);

module.exports = router;
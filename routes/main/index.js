const router = require('express').Router();
const authGuest = require('../../middleware/authGuest');
const authUser = require('../../middleware/authUser');
const userController = require('../../controllers/userController');

router.get('/', userController.getHome);
router.get('/sign-up', authGuest, userController.getSignUpForm);
router.get('/login', authGuest, userController.getLoginForm);
router.get('/dashboard', authUser, userController.getDashboard);
router.get('/logout', authUser, userController.getLogout);

router.post('/sign-up', authGuest, userController.postSignUpForm);
router.post('/login', authGuest, userController.postLoginForm);

module.exports = router;
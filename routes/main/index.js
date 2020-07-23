const router = require('express').Router();
const authGuest = require('../../middleware/authGuest');
const authUser = require('../../middleware/authUser');
const userController = require('../../controllers/userController');

router.get('/', userController.getHome);
router.get('/sign-up', authGuest, userController.getSignUpForm);
router.get('/login', authGuest, userController.getLoginForm);
router.get('/dashboard', authUser, userController.getDashboard);

router.post('/sign-up', authGuest, userController.postSignUpForm);
router.post('/login', authGuest, userController.postLoginForm);
router.post('/logout', authUser, userController.postLogout);

module.exports = router;
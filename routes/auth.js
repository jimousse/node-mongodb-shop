const router = require('express').Router();

const authController = require('../controllers/auth');
const { emailExistsValidator, passwordValidator, emailNotExistsValidator, confirmPasswordValidator } = require('./validators/index');

router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    emailExistsValidator,
    passwordValidator
  ],
  authController.postLogin
);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    emailNotExistsValidator,
    passwordValidator,
    confirmPasswordValidator
  ],
  authController.postSignup
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
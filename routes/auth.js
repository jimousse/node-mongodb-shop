const { check, body } = require('express-validator');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

const authController = require('../controllers/auth');

/*
  valid: user with this email exists
  invalid: no user with this email
*/
const emailExistsValidator = check('email')
  .isEmail()
  .withMessage('Please enter a valid email.')
  .normalizeEmail()
  .custom((value, { req }) => {
    return User.findByEmail(value)
      .then(user => {
        if (!user) {
          return Promise.reject('Email does not exists.');
        }
      });
  });

/*
  valid: no user with this email
  invalid: user with this email exists
*/
const emailNotExistsValidator = check('email')
  .isEmail()
  .withMessage('Please enter a valid email.')
  .normalizeEmail()
  .custom((value, { req }) => {
    return User.findByEmail(value)
      .then(user => {
        if (user) {
          return Promise.reject('Email exists already.');
        }
      });
  });

const passwordValidator = body('password')
  .isLength({ min: 5 })
  .withMessage('Password must be 5 characters long min.')
  .trim();


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
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value === req.body.password) return true;
        throw new Error('Passwords must be the same.');
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
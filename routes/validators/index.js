const { check, body } = require('express-validator');
const User = require('../../models/user');
exports.bookEntryValidators = [
  check('title')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Book title must be at least one character long.')
    .trim(),
  check('price')
    .isFloat()
];


/*
  valid: user with this email exists
  invalid: no user with this email
*/
exports.emailExistsValidator = check('email')
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
exports.emailNotExistsValidator = check('email')
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


exports.passwordValidator = body('password')
  .isLength({ min: 5 })
  .withMessage('Password must be 5 characters long min.')
  .trim();

exports.confirmPasswordValidator = body('confirmPassword')
  .custom((value, { req }) => {
    if (value === req.body.password) return true;
    throw new Error('Passwords must be the same.');
  })
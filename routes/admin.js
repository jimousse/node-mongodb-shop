const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isLoggedIn = require('../middleware/is-auth');

const router = express.Router();

const bookEntryValidators = [
  check('title')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Book title must be at least one character long.')
    .trim(),
  check('price')
    .isFloat()
];

router.get('/add-product', isLoggedIn, adminController.getAddProduct);
router.get('/products', isLoggedIn, adminController.getProducts);

router.post(
  '/add-product',
  ...bookEntryValidators,
  isLoggedIn,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isLoggedIn, adminController.getEditProduct);

router.post(
  '/edit-product',
  ...bookEntryValidators,
  isLoggedIn,
  adminController.postEditProduct
);

router.delete('/product/:productId', isLoggedIn, adminController.deleteProduct);

module.exports = router;

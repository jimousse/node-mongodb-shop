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
  check('imageUrl')
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  check('price')
    .isFloat()
];

// admin/add-product => GET
router.get('/add-product', isLoggedIn, adminController.getAddProduct);

// // /admin/products => GET
router.get('/products', isLoggedIn, adminController.getProducts);

// admin/add-product => POST
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

router.post('/delete-product', isLoggedIn, adminController.postDeleteProduct);

module.exports = router;

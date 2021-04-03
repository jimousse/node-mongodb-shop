const router = require('express').Router();

const { bookEntryValidators } = require('./validators/index');
const adminController = require('../controllers/admin');
const isLoggedIn = require('../middlewares/is-auth');

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

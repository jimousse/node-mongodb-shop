const router = require('express').Router();

const isLoggedIn = require('../middlewares/is-auth');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isLoggedIn, shopController.getCart);
router.post('/cart', isLoggedIn, shopController.postCart);
router.post('/cart-delete-item', isLoggedIn, shopController.postCartDeleteProduct);
router.post('/create-order', isLoggedIn, shopController.postOrder);
router.get('/orders', isLoggedIn, shopController.getOrders);
router.get('/orders/:orderId', isLoggedIn, shopController.getInvoice);

module.exports = router;

const isLoggedIn = require('../middleware/is-auth');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isLoggedIn, shopController.getCart);

router.post('/cart', isLoggedIn, shopController.postCart);

router.post('/cart-delete-item', isLoggedIn, shopController.postCartDeleteProduct);

router.post('/create-order', isLoggedIn, shopController.postOrder);

router.get('/orders', isLoggedIn, shopController.getOrders);

module.exports = router;

const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const User = require('../models/user');
const PDFKit = require('pdfkit');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      let totalPrice = 0;
      products.forEach(product => {
        totalPrice += Number(product.productTotalPrice);
      });
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        totalPrice
      });
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteFromCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  User.findOrderById(orderId)
    .then(order => {
      if (!order) return next(new Error('No order found.'));
      // restrict access to the correct user
      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized.'));
      }
      const invoice = `invoice-${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoice);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=${invoice}`);

      const pdfDoc = new PDFKit();
      // writes on the serser
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      // writes into the response
      pdfDoc.pipe(res);
      pdfDoc.fontSize(20).text('Invoice');
      pdfDoc.fontSize(15).text('-------------------');
      order.items.forEach(item => {
        pdfDoc.text(`- ${item.title}, x${item.quantity}, $${item.productTotalPrice}`);
      });
      pdfDoc.text('-------------------');
      pdfDoc.text(`Total: $${order.totalPrice}`)
      pdfDoc.end();

      console.log('Sending invoice file', invoicePath);
    })
    .catch(err => next(err));
}

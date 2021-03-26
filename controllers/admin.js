const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null
  });
};

exports.postAddProduct = (req, res, next) => {
  const DEFAULT_URL = 'https://thumbs-prod.si-cdn.com/ufPRE9RHUDHqQdOsLvYHhJAxy1k=/fit-in/1600x0/https://public-media.si-cdn.com/filer/91/91/91910c23-cae4-46f8-b7c9-e2b22b8c1710/lostbook.jpg';
  const { title, imageUrl, price, description } = req.body;
  const user = req.user;
  const product = new Product({
    title,
    imageUrl: imageUrl || DEFAULT_URL,
    price,
    description,
    userId: user._id,
  });
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: { title, imageUrl, price, description },
      errorMessage: errors.array()[0].msg,
      hasError: true,
    });
  }
  product
    .save()
    .then(() => {
      console.log('Successfully created product!');
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      if (String(product.userId) !== String(req.user._id)) {
        console.log('Logged in user cannot delete this product.');
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: null,
        hasError: false,
        oldInput: {}
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: { title, imageUrl, price, description, _id: productId },
      errorMessage: errors.array()[0].msg,
      hasError: true,
    });
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        console.log('No product found with this id. Redirecting to home.');
        return res.redirect('/');
      }
      if (String(product.userId) !== String(req.user._id)) {
        console.log('Logged in user cannot delete this product.');
        return res.redirect('/');
      }
      Product.updateProduct(productId, { title, price, description, imageUrl })
        .then(() => {
          res.redirect('/admin/products');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.getProductsByUserId(req.user._id)
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

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
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  let errorMessage = null;
  if (!errors.isEmpty()) {
    errorMessage = errors.array()[0].msg;
  } else if (!image) {
    errorMessage = 'Attached file not an image';
  }
  if (errorMessage) {
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      product: { title, price, description },
      errorMessage,
      hasError: true,
    });
  }


  // store file path in db and store file in OS
  const imageUrl = image.path;
  const user = req.user;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: user._id,
  });
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
  const { productId, title, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: { title, price, description, _id: productId },
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
      const updateSet = { title, price, description };
      // check if new image uploaded
      if (req.file) {
        updateSet.imageUrl = req.file.path;
      }
      Product.updateProduct(productId, updateSet)
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

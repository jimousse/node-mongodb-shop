const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const DEFAULT_URL = 'https://thumbs-prod.si-cdn.com/ufPRE9RHUDHqQdOsLvYHhJAxy1k=/fit-in/1600x0/https://public-media.si-cdn.com/filer/91/91/91910c23-cae4-46f8-b7c9-e2b22b8c1710/lostbook.jpg';
  const user = req.user;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl || DEFAULT_URL;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({ title, imageUrl, price, description, userId: user._id });
  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  console.log('helloooooo');
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
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const product = new Product({ title, id, price, description, imageUrl });
  product.save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

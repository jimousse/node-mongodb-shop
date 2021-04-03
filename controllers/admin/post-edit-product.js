const Product = require('../../models/product');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../../util/file');

module.exports = async (req, res, next) => {
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
  try {
    const product = await Product.findById(productId);
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
      // update with new image
      updateSet.imageUrl = req.file.path;
      // delete image from the server
      deleteFile(product.imageUrl);
    }
    await Product.updateProduct(productId, updateSet);
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
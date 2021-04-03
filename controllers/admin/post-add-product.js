const { validationResult } = require('express-validator');
const Product = require('../../models/product');

module.exports = async (req, res, next) => {
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
  try {
    await product.save();
    console.log('Successfully created product!');
    res.redirect('/admin/products');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
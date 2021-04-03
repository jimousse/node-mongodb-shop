const Product = require('../../models/product');

module.exports = async (req, res, next) => {
  try {
    const products = await Product.getProductsByUserId(req.user._id);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
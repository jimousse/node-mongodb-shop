module.exports = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.user.deleteFromCart(prodId);
    res.redirect('/cart');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
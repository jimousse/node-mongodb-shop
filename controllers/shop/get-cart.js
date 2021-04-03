module.exports = async (req, res, next) => {
  const products = await req.user.getCart();
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
};
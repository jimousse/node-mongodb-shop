const Product = require('../../models/product');

module.exports = async (req, res, next) => {
  const prodId = req.params.productId;
  try {
    await Product.deleteById(prodId);
    console.log('Deleting product', prodId);
    res.status(200).json({ message: 'Successfully delete product.' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Deleting product failed.' });
  }
};

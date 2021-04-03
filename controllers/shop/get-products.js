const Product = require('../../models/product');
const { ITEMS_PER_PAGE } = require('../../models/constants');

const controllerFactory = (viewPath, pageTitle, path) => {
  return async (req, res, next) => {
    const pageNumber = Number(req.query.page) || 1; // get page param;
    try {
      const totalItems = await Product.count();
      const products = await Product.getProductsByPage(pageNumber);
      res.render(viewPath, {
        prods: products,
        pageTitle,
        path,
        totalItems,
        hasNextPage: (pageNumber * ITEMS_PER_PAGE < totalItems),
        hasPreviousPage: pageNumber > 1,
        currentPage: pageNumber,
        previousPage: pageNumber - 1,
        nextPage: pageNumber + 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      })
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    }
  };
}


exports.getIndex = controllerFactory('shop/index', 'Shop', '/');
exports.getProducts = controllerFactory('shop/product-list', 'All Products', '/products');
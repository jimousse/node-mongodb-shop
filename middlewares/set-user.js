const User = require('../models/user');

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      // store the model, not just the data
      req.user = new User({
        username: user.username,
        email: user.email,
        cart: user.cart,
        id: user._id
      });
      next();
    })
    .catch(e => {
      next(new Error(e));
    })
}
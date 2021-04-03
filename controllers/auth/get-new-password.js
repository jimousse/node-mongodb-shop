const User = require('../../models/user');

module.exports = async (req, res, next) => {
  const token = req.params.token;
  try {
    const user = await User.findUser({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Token invalid for password reset');
      return res.redirect('/');
    }
    res.render('auth/new-password', {
      path: '/reset',
      pageTitle: 'New Password',
      errorMessage: null,
      userId: user._id,
      passwordToken: token
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
}
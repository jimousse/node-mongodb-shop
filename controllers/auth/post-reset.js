const crypto = require('crypto');
const User = require('../../models/user');

module.exports = async (req, res, next) => {
  let buffer;
  try {
    buffer = await crypto.randomBytes(32);
  } catch (err) {
    console.log(err);
    return res.redirect('/reset');
  }
  try {
    const token = buffer.toString('hex');
    const user = await User.findByEmail(req.body.email);

    if (!user) {
      console.log('No account found');
      req.flash('error-password-reset', 'No account with that email found.');
      return res.redirect('/reset');
    }

    await User.updateUser(user._id, {
      resetToken: token,
      resetTokenExpiration: Date.now() + 3600000
    });
    const resetUrl = `http://localhost:3000/reset/${token}`;
    console.log('Reset URL', resetUrl);
    res.send(`Go to this url to reset password ${resetUrl}`)
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};
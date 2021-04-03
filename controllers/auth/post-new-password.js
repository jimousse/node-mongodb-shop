const User = require('../../models/user');
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  const { password, _userId, _passwordToken } = req.body;
  try {
    const user = await User.findUser({
      _id: new mongodb.ObjectId(_userId),
      resetToken: _passwordToken,
      resetTokenExpiration: { $gt: Date.now() }
    });
    if (!user) {
      console.log('User not found, cannot reset password.');
      return res.redirect('/');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateUser(_userId, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiration: undefined
    });
    console.log('Password reset successful!');
    res.redirect('/');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
}
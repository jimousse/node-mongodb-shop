const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../../models/user');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password },
        validationErrors: errors.array()
      });
  }
  let user;
  try {
    const user = await User.findByEmail(email);
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      console.log('Passwords match, authentication successful.');
      const { username, email, _id, cart } = user;
      req.session.isLoggedIn = true;
      req.session.user = new User({ username, email, id: _id, cart });
      return req.session.save(() => {
        return res.redirect('/');
      });
    } else {
      return res
        .status(422)
        .render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalild email or password.',
          oldInput: { email, password },
          validationErrors: []
        });
    }
  } catch (err) {
    console.log(e);
    res.redirect('/login');
  }
};
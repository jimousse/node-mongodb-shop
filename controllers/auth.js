const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const mongodb = require('mongodb');
const { validationResult } = require('express-validator');

const User = require('../models/user');


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: null,
    oldInput: { email: "", password: "" },
    validationErrors: []
  })
};


exports.postLogin = (req, res, next) => {
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
  User.findByEmail(email)
    .then(userFound => {
      user = userFound;
      return bcrypt.compare(password, userFound.password)
    })
    .then(doMatch => {
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
    })
    .catch(e => {
      console.log(e);
      res.redirect('/login');
    });
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: null,
    oldInput: { emai: "", password: "", confirmPassword: "" },
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: { email, password, confirmPassword },
        validationErrors: errors.array()
      });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email,
        password: hashedPassword
      });
      return newUser.save();
    })
    .then(() => {
      console.log('Signup successful: ', email);
      res.redirect('/login');
      // transporter.sendMail({
      //   to: email,
      //   from: 'frenchguycodes@gmail.com',
      //   subject: 'Signing up!',
      //   html: '<b>Signup email</b>'
      // });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash('error-password-reset');
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findByEmail(req.body.email)
      .then((user) => {
        if (!user) {
          console.log('No account found');
          req.flash('error-password-reset', 'No account with that email found.');
          return res.redirect('/reset');
        }
        return User.updateUser(user._id, {
          resetToken: token,
          resetTokenExpiration: Date.now() + 3600000
        });
      })
      .then(() => {
        res.redirect('/');
        // transporter.sendMail({
        //   to: req.body.email,
        //   from: 'frenchguycodes@gmail.com',
        //   subject: 'Password reset',
        //   html: `
        //     <p> You requested password reset </p>
        //     http://localhost:3000/reset/${token}
        //   `
        // });
        console.log(`http://localhost:3000/reset/${token}`);
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(error);
      });
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findUser({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then((user) => {
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
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
}

exports.postNewPassword = (req, res, next) => {
  const { password, _userId, _passwordToken } = req.body;
  User.findUser({
    _id: new mongodb.ObjectId(_userId),
    resetToken: _passwordToken,
    resetTokenExpiration: { $gt: Date.now() }
  })
    .then((user) => {
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      return User.updateUser(_userId, {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined
      });
    })
    .then(() => {
      console.log('Password reset successful!');
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
}
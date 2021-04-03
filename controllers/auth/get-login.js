module.exports = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: null,
    oldInput: { email: "", password: "" },
    validationErrors: []
  })
};

module.exports = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: null,
    oldInput: { emai: "", password: "", confirmPassword: "" },
    validationErrors: []
  });
};

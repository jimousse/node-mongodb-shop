module.exports = (req, res, next) => {
  req.session.destroy(() => {
    console.log('Successfully logged out.');
    res.redirect('/');
  });
};

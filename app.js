const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');


const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb://127.0.0.1:27017/shop';
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf({});
const flash = require('connect-flash');

const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'jimmy',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
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
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);


app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500'
  });
});

mongoConnect(() => {
  app.listen(3000);
});

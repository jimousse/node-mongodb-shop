const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const csrf = require('csurf');
const mongoConnect = require('./util/database').mongoConnect;
const MongoDBStore = require('connect-mongodb-session')(session);
const csrfProtection = csrf({});
const flash = require('connect-flash');
require('dotenv').config();

// middleware
const fileUploadMw = require('./middlewares/file-upload');
const sessionMw = require('./middlewares/session');
const setUserInSession = require('./middlewares/set-user');

// controllers
const errorController = require('./controllers/error');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// db
const MONGODB_URI = `${process.env.DB_CONNECTION}/${process.env.DB_NAME}`;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// app
const app = express();

// view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUploadMw);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 'jimmy',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrfProtection);
app.use(flash());
app.use(sessionMw);
app.use(setUserInSession);

// set routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/500', errorController.get500);
app.use(errorController.get404);

// error handling
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
  });
});

mongoConnect(() => {
  app.listen(process.env.PORT || 3000);
});

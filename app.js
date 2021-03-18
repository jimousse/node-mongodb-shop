const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database').mongoConnect;

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6051bfd0147b9746267071e9')
    .then(user => {
      const { username, email, _id, cart } = user;
      req.user = new User({ username, email, id: _id, cart });
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

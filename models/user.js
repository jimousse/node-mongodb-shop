const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const COLLECTION_NAME = 'users';

class User {
  constructor({ password, email, cart, id }) {
    this.email = email;
    this.password = password;
    this.cart = cart || { items: [] }; // {items: []}
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(p => {
      return p.productId.toString() == product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    // product already in the cart
    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity += 1;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    return db.collection('products')
      .find({
        _id: { $in: this.cart.items.map(item => item.productId) }
      })
      .toArray()
      .then(products => {
        // add quantity to the product we're returning
        return products.map(product => {
          const cartProductIndex = this.cart.items.findIndex(p => {
            return p.productId.toString() == product._id.toString();
          });
          const productQuantity = this.cart.items[cartProductIndex].quantity;
          return {
            ...product,
            productTotalPrice: Number(productQuantity) * Number(product.price),
            quantity: productQuantity
          };
        });
      });
  }

  deleteFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(i => {
      return i.productId.toString() !== productId.toString();
    });
    const updatedCart = {
      items: updatedCartItems
    };
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        let totalPrice = 0;
        products.forEach(product => {
          totalPrice += Number(product.quantity) * Number(product.price);
        });
        const order = {
          items: products,
          totalPrice,
          userId: new mongodb.ObjectId(this._id)
        };
        return db.collection('orders').insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };
        return this.resetCart();
      });
  }

  resetCart() {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders')
      .find({ userId: new mongodb.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find({ _id: new mongodb.ObjectId(userId) })
      .next();
  }

  static findByEmail(email) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find({ email })
      .next();
  }

  static updateUser(id, updateSet) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: mongodb.ObjectId(id) },
        { $set: updateSet }
      )
      .then(() => {
        console.log(`Updating existing user ${id} with`, updateSet);
      })
      .catch(e => console.log(e));
  }

  static findUser(filter) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find(filter)
      .next();
  }
}

module.exports = User;


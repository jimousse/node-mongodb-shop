const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

const COLLECTION_NAME = 'products';

class Product {
  constructor({ title, price, description, imageUrl, id, userId }) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this._id = id ? new mongodb.ObjectId(id) : null;

  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection(COLLECTION_NAME).updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: this }
      );
    } else {
      dbOp = db.collection(COLLECTION_NAME).insertOne(this);
    }
    return dbOp
      .then(result => {
        return result;
      })
      .catch(e => console.log(e));
  }

  static fetchAll() {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(e => console.log(e));
  }

  static findById(id) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find({ _id: mongodb.ObjectId(id) }) // mongodb stored ids like this
      .next() // cursor
      .then(product => product)
      .catch(e => console.log(e));
  }

  static deleteById(id) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then(product => {
        console.log('deleted');
      })
      .catch(e => console.log(e));
  }
}

module.exports = Product;

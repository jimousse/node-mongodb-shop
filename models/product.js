const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const { deleteFile } = require('../util/file');
const { ITEMS_PER_PAGE } = require('./constants');
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

  static getProductsByPage(pageNumber = 1) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find()
      .skip((pageNumber - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .toArray();
  }

  static count() { // faster than retrieving them
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find()
      .count();
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
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then(product => {
        console.log('Deleting product:', product._id);
        if (product.imageUrl) {
          console.log('Deleting product image:', product._id);
          return deleteFile(product.imageUrl);
        }
      })
      .then(() => {
        return db.collection(COLLECTION_NAME)
          .deleteOne({ _id: new mongodb.ObjectId(id) });
      })
      .catch(e => console.log(e));
  }

  static updateProduct(id, updateSet) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .updateOne(
        { _id: mongodb.ObjectId(id) },
        { $set: updateSet }
      )
      .then(() => {
        console.log(`Updating existing product ${id} with`, updateSet);
      })
      .catch(e => console.log(e));
  }

  static getProductsByUserId(userId) {
    const db = getDb();
    return db.collection(COLLECTION_NAME)
      .find({ userId })
      .toArray();
  }
}

module.exports = Product;

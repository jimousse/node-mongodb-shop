const MongoClient = require('mongodb').MongoClient;

const USER = 'jimmy';
const PASSWORD = 'Cp5sH2pzhNy4aJg';
const DB = 'shop';
const URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.itoni.mongodb.net/${DB}?retryWrites=true&w=majority`;

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

const mongoConnect = (callback) => {
  console.log('trying to connect');
  client.connect()
    .then((client) => {
      console.log('Connected to database.');
      _db = client.db();
      callback();
    })
    .catch((e) => {
      console.log(e)
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

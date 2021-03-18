const MongoClient = require('mongodb').MongoClient;

const DB = 'shop';
const URI = `mongodb://127.0.0.1:27017`;


const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

const mongoConnect = (callback) => {
  console.log('trying to connect');
  client.connect()
    .then((client) => {
      console.log('Connected to database.');
      _db = client.db(DB);
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

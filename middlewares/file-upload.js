const multer = require('multer');

const SUPPORTED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg'
];
const REQ_FIELD_NAME = 'image';
const DEST_FOLDER = 'images';

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DEST_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${REQ_FIELD_NAME}-${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (SUPPORTED_MIME_TYPES.indexOf(file.mimetype) >= 0) {
    cb(null, true);
  } else {
    console.log('Wrong image type.');
    cb(null, false);
  }
};

module.exports = multer({
  storage: fileStorage,
  fileFilter
}).single(REQ_FIELD_NAME);
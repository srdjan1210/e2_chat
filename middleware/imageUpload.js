const path = require('path'); 
const multer = require('multer'); 

var storage = multer.diskStorage({ 
    destination: path.join(__dirname, '../public/uploads/imgs/'),
    filename: function (req, file, cb) {
      cb(null, (req.body.username || req.payload.username) + '.png');
    }
});

var upload = multer({ storage }).single('image');

module.exports = { upload };
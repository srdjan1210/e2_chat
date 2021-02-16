const path = require('path'); 
const multer = require('multer'); 

var storage = multer.diskStorage({ 
    destination: path.join(__dirname, '../public/uploads/imgs/'),
    filename: function (req, file, cb) {
      console.log(req);
      cb(null,  req.body.username + '.png');
    }
});

var upload = multer({ storage }).single('image');

module.exports = { upload };
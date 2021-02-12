const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');
const { upload } = require('../middleware/imageUpload'); 

router.post('/', upload, registerUser );


module.exports = router;
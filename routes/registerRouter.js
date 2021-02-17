const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/registerController');
const { upload } = require('../middleware/imageUpload'); 
const { registerValidation } = require('../middleware/requestValidation');

router.post('/', [upload, registerValidation], registerUser );



module.exports = router;
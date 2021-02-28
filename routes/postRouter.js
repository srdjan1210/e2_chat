const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const { checkTokenValidity } = require('../middleware/webtoken');
const { upload } = require('../middleware/imageUpload');


router.post('/create',[checkTokenValidity, upload], createPost);


module.exports = router;
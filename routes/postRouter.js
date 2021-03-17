const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const { checkTokenValidity } = require('../middleware/webtoken');
const { uploadPost, getAllPostsForUser, getPostForUser, deletePost, updatePost } = require('../middleware/imageUpload');


router.post('/create',[checkTokenValidity, uploadPost], createPost);
router.post('/post',[checkTokenValidity], getPostForUser);
router.get('/posts', [checkTokenValidity], getAllPostsForUser);
router.delete('/post', [checkTokenValidity], deletePost);
router.update('/edit', [checkTokenValidity], updatePost);


module.exports = router;
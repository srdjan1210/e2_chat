const express = require('express');
const router = express.Router();
const { createPost,  getAllPostsForUser, getSinglePost, deletePost, updatePost} = require('../controllers/postController');
const { checkTokenValidity } = require('../middleware/webtoken');
const { uploadPost } = require('../middleware/imageUpload');


router.post('/create',[checkTokenValidity, uploadPost], createPost);
router.get('/post',[checkTokenValidity], getSinglePost);
router.get('/posts', [checkTokenValidity], getAllPostsForUser);
router.delete('/post', [checkTokenValidity], deletePost);
router.patch('/edit', [checkTokenValidity], updatePost);


module.exports = router;
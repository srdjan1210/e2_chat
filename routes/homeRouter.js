const express = require('express');
const router = express.Router();
const { userinfo, chatsinfo, messageLoader } = require('../controllers/homeController');
const { checkTokenValidity } = require('../middleware/webtoken');

router.post('/userinfo',checkTokenValidity, userinfo);
router.post('/chatinfo', checkTokenValidity, chatsinfo);


module.exports = router;
const express = require('express');
const router = express.Router();
const { userinfo } = require('../controllers/homeController');
const { checkTokenValidity } = require('../middleware/webtoken');

router.post('/userinfo',checkTokenValidity, userinfo);


module.exports = router;
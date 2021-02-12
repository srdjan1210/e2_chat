const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');
const { checkTokenValidity } = require('../middleware/webtoken');

router.post('/', checkTokenValidity, loginUser);

module.exports = router;
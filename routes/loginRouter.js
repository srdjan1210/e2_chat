const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/loginController');
const { checkTokenValidity } = require('../middleware/webtoken');
const { loginValidation } = require('../middleware/requestValidation');

router.post('/', [loginValidation, checkTokenValidity], loginUser);

module.exports = router;
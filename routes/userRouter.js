const express = require('express');
const router = express.Router();
const { publicUserInfo, changeFirstname, changeLastname, changeEmail, changePassword } = require('../controllers/userController');
const { checkTokenValidity } = require('../middleware/webtoken');

router.post('/:username', checkTokenValidity, publicUserInfo);
router.post('/change/password', checkTokenValidity, changePassword);
router.post('/change/firstname', checkTokenValidity, changeFirstname);
router.post('/change/lastname', checkTokenValidity, changeLastname);
router.post('/change/email', checkTokenValidity, changeEmail);




module.exports = router;
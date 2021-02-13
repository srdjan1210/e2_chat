const express = require('express');
const router = express.Router();
const { publicUserInfo, changeFirstname, changeLastname, changeEmail } = require('../controllers/userController');


router.get('/:username', publicUserInfo);
router.post('/change/password', changePassword);
router.post('/change/firstname', changeFirstname);
router.post('/change/lastname', changeLastname);
router.post('/change/', changeEmail);




module.exports = router;
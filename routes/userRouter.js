const express = require('express');
const router = express.Router();
const { checkTokenValidity } = require('../middleware/webtoken');
const { publicUserInfo, changeFirstname, changeLastname,
        changeEmail, changePassword, changeCity, changeBirthday,
        changeCountry, changeBiography, changeAdress, changeProvince, changeNationality } = require('../controllers/userController');


router.post('/:username', checkTokenValidity, publicUserInfo);
router.post('/change/password', checkTokenValidity, changePassword);
router.post('/change/firstname', checkTokenValidity, changeFirstname);
router.post('/change/lastname', checkTokenValidity, changeLastname);
router.post('/change/email', checkTokenValidity, changeEmail);
router.post('/change/city', checkTokenValidity, changeCity);
router.post('/change/birthday', checkTokenValidity, changeBirthday);
router.post('/change/country', checkTokenValidity, changeCountry);
router.post('/change/nationality', checkTokenValidity, changeNationality);
router.post('/change/biography', checkTokenValidity, changeBiography);
router.post('/change/adress', checkTokenValidity, changeAdress);
router.post('/change/province', checkTokenValidity, changeProvince);



module.exports = router;
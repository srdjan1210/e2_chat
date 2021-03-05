const express = require('express');
const router = express.Router();
const { checkTokenValidity } = require('../middleware/webtoken');
const { publicUserInfo, changeFirstname, changeLastname,
        changeEmail, changePassword, changeCity, changeBirthday,
        changeCountry, changeBiography, changeAdress, changeProvince, changeNationality,
        editHandler } = require('../controllers/userController');

router.post('/edit', checkTokenValidity, editHandler);
router.post('/:username', checkTokenValidity, publicUserInfo);
router.post('/edit/password', checkTokenValidity, changePassword);
router.post('/edit/firstname', checkTokenValidity, changeFirstname);
router.post('/edit/lastname', checkTokenValidity, changeLastname);
router.post('/edit/email', checkTokenValidity, changeEmail);
router.post('/edit/city', checkTokenValidity, changeCity);
router.post('/edit/birthday', checkTokenValidity, changeBirthday);
router.post('/edit/country', checkTokenValidity, changeCountry);
router.post('/edit/nationality', checkTokenValidity, changeNationality);
router.post('/edit/biography', checkTokenValidity, changeBiography);
router.post('/edit/adress', checkTokenValidity, changeAdress);
router.post('/edit/province', checkTokenValidity, changeProvince);



module.exports = router;
const express = require('express');
const router = express.Router();
const { checkTokenValidity } = require('../middleware/webtoken');
const { checkForEmptyString, checkForInvalidProperty, checkIfParameterExists } = require('../middleware/editRouteProtection');
const { publicUserInfo, changeEmail, changePassword, editHandler, changeNormalProperty } = require('../controllers/userController');

router.post('/edit', checkTokenValidity, editHandler);
router.post('/:username', checkTokenValidity, publicUserInfo);
router.post('/edit/password', checkTokenValidity, changePassword);
router.post('/edit/email', checkTokenValidity, changeEmail);
router.post('/edit/:propname', [checkTokenValidity, checkForInvalidProperty, checkIfParameterExists, checkForEmptyString], changeNormalProperty);



module.exports = router;
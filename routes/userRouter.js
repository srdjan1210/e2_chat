const express = require('express');
const router = express.Router();
const { checkTokenValidity, checkIfTokenExists } = require('../middleware/webtoken');
const { checkForEmptyString, checkForInvalidProperty, checkIfParameterExists,
        checkIfPasswordDataExists, checkIfPropertyExists } = require('../middleware/editRouteProtection');
const { upload } = require('../middleware/imageUpload');
const { publicUserInfo, changeEmail, changePassword, editHandler, changeNormalProperty, changeUsername, changeProfilePicture } = require('../controllers/userController');

router.post('/edit', [checkTokenValidity, checkIfTokenExists], editHandler);
router.post('/:username', [checkTokenValidity, checkIfTokenExists], publicUserInfo);
router.post('/edit/password', [checkTokenValidity, checkIfTokenExists, checkIfPasswordDataExists], changePassword);
router.post('/edit/email', [checkTokenValidity, checkIfTokenExists, checkIfPropertyExists], changeEmail);
router.post('/edit/username', [checkTokenValidity, checkIfTokenExists, checkIfPropertyExists], changeUsername);
router.post('/edit/image', [checkTokenValidity, upload], changeProfilePicture);
router.post('/edit/:propname', [checkTokenValidity, checkIfTokenExists, checkForInvalidProperty, checkIfParameterExists, checkForEmptyString], changeNormalProperty);

module.exports = router;
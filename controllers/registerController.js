const _ = require('lodash');
const path = require('path');
const { validateUserData } = require('./validationController');
const { checkIfUserExists, saveUserToDatabase } = require('../models/user');
const { hashPassword } = require('../middleware/hash');
const { trimUserData } = require('../helpers/stringOperations');
const { resizeProfileImage } = require('../image-formatters/resize');
const { uploadImages, getImageUrl } = require('../helpers/firebase-upload');


registerUser = async (req, res) => {
    const user = _.pick(req.body,['email', 'username', 'password','lastname', 'firstname']);
    trimUserData(user);
    const names = await resizeProfileImage(user.username);
    const validated = validateUserData(_.pick(user, ['email', 'username']));  
    if(validated.error) return res.status(409).send({err: validated.error.details[0].message});
    
    const registered = await checkIfUserExists(user);

    if(registered != null) return res.status(409).send({err: "User alredy exists"});
    await uploadImages(names);
    const profile_img_100 = (await getImageUrl(names[0]))[0];
    const profile_img_300 = (await getImageUrl(names[1]))[0];
    saveUserToDatabase({
        username: user.username,
        password: await hashPassword(user.password),
        email: user.email,
        created: Date.now(),
        lastActiveAt: null,
        lastname: user.lastname,
        firstname: user.firstname,
        profile_img_100,
        profile_img_300
    }).then(saved => {
        req.app.get('emitter').emit('user registered', saved);
        if(saved) return res.status(201).send(_.pick(saved,['_id', 'username', 'email']));
    }).catch(err => {
        console.log(err);
        return res.status(422).send({err : "Database problem"});
    });

}




module.exports = { registerUser };
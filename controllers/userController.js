const _ = require('lodash');
const { validateEmail, validatePassword, validateUsername } = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate, saveUserObject } = require('../models/user');
const hash = require('../middleware/hash');
const { createToken } = require('../middleware/webtoken');
const { uploadImages, getImageUrl } = require('../helpers/firebase-upload');
const { resizeProfileImage } = require('../image-formatters/resize');
const { array } = require('joi');



const editHandler = async (req, res) => {
    try { 
        const edited = await editPropertiesOfObject(req.body, req.payload.username);
        return res.status(200).send(edited);
    }catch(err) {
        return res.status(500).send({ err: 'Something went wrong!'})
    }
}



//Addition validation needed 
const publicUserInfo = async (req, res) => {
    const username = req.params.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        return res.status(409).send({});
    res.status(200).send(_.pick(user, ['username', 'firstname', 'lastname']));  
}

const changeEmail = async (req, res) => {
    const username = req.payload.username;
    const email = req.body.email;
    
    const validated = validateEmail(email);
    if(validated.error) return res.status(422).send({ err: 'Not valid email!'});

    try {
        const user = await findUserAndUpdate({ username }, { email });
        if(user == null)
            return res.status(409).send({ err: 'Could not find specific user!'});
        res.status(200).send({msg: 'Email updated succesfully!'});
    } catch(err) {
        console.log(err);
        res.status(422).send({ err: 'Email alredy in use!'});
    }
}

const changePassword = async (req, res) => {
    req.body.username = req.payload.username;
    const { username, password, new_password } = _.pick(req.body, ['username', 'password', 'new_password'])
    const user = await findUserByUsername({ username });
    const validOldPassword = await hash.verifyPassword(password, user.password);
    
    if(!validOldPassword) return res.status(403).send({ err: 'Data provided not valid!' });
    
    const validateNewPassword = validatePassword(new_password);
    if(validateNewPassword.error) return res.status(403).send({ err: 'New password not valid'});

    const hashPassword = await hash.hashPassword(new_password);
    user.password = hashPassword;
    await saveUserObject(user);

    res.status(200).send({msg: 'Password updated succesfully'});
} 

const changeUsername = async(req, res) => {
    const oldUsername = req.payload.username;
    const { username } = _.pick(req.body, ['username']);
    const user = await findUserByUsername({ username: oldUsername });
    const existingUser = await findUserByUsername({ username });
    const validatedUsername = validateUsername(username);

    if(user == null) return res.status(400).send({err: 'User doesnt exists!'})
    if(validatedUsername.error) return res.status(400).send({ err: 'Invalid username!'});
    if(existingUser != null) return res.status(400).send({ err: 'User alredy exists!'});

    user.username = username;
    await saveUserObject(user);
    const token = await createToken({ _id: user._id, username: user.username });
    res.header('x-auth', token);
    res.status(200).send({msg: 'Username changed succesfully!'});
}

const changeProfilePicture = async (req, res) => {
    const username = req.payload.username;
    const names = await resizeProfileImage(username);
    await uploadImages(names);
    const profile_img_100 = (await getImageUrl(names[0]))[0];
    const profile_img_300 = (await getImageUrl(names[0]))[0];
    const user = await findUserAndUpdate({ username }, { profile_img_100, profile_img_300});
    if(user == null) return res.status(422).send({ err: 'User not found'});
    return res.status(200).send({ profile_img_100, profile_img_300 });
}

//Schematic approach with simillar functions
const changeNormalProperty  = async (req, res) => {
    const propertyName = req.params.propname;
    const resp = await changeProperty(req, propertyName, ['_id', propertyName]);
    if(resp.err) return resp.status(409).send(resp);
    res.status(200).send(resp);
}

const changeProperty = async (req, property, data) => {
    let updateProperty = {};
    req.body._id = req.payload._id;
    const properties = _.pick(req.body, data);

    updateProperty[property] = properties[property];
    const user =  await findUserAndUpdate({ _id: properties._id }, { ...updateProperty });
    

    if(user == null) return { err: 'Could not find specific users!' }
    return { msg: ' Succesfully changed given property!'}
}

const editPropertiesOfObject = async (properties, objectUsername) => {
    let user = await findUserByUsername({ username: objectUsername });
    let response = {};
    if(user == null) return response;

    for(let property of Object.entries(properties)) {
        if(property[1] != null && property[0] != '_id' && property[0] != 'password' && property[0] != 'username' && property[0] != 'email') {
            user[property[0]] = property[1];
            response[property[0]] = property[1];
        }
    }

    await saveUserObject(user);
    return response;
}

module.exports =  { publicUserInfo, changeEmail, changePassword, editHandler, changeNormalProperty, changeUsername, changeProfilePicture }
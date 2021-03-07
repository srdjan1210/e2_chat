const _ = require('lodash');
const { validateEmail, validatePassword, validateUsername } = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate, saveUserObject } = require('../models/user');
const hash = require('../middleware/hash');
const { createToken } = require('../middleware/webtoken');
const { identity } = require('lodash');



const editHandler = async(req, res) => {
    let response = {};
    if(!req.body._id) return res.status(400).send({err : 'User id missing!'});

    for(let property of Object.entries(req.body))
        if(property[1] != null && property[0] != '_id' && property[0] != 'password' && property[0] != 'username' && property[0] != 'email'){
            response[property[0]] = await changeProperty(req, property[0], ['_id', property[0]]);
        }
    return res.status(200).send(response);
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
    req.body.username = req.payload.username;
    const { email, username } = _.pick(req.body, ['email', 'username']);
    const validated = validateEmail(email);
    
    if(validated.error) return res.status(422).send({ err: 'Not valid email!'});

    try {
        const user = await findUserAndUpdate({ username }, { email });
        if(user == null)
            return res.status(409).send({ err: 'Could not find specific user!'});
        res.status(200).send('Email updated succesfully!');
    } catch(err) {
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

    res.status(200).send('Password updated succesfully');
} 

const changeUsername = async(req, res) => {
    const oldUsername = req.payload.username;
    const { username } = _.pick(req.body, ['username']);
    const user = await findUserByUsername({ username: oldUsername });
    const existingUser = await findUserByUsername({ username });
    const validUsername = validateUsername(username);
    if(user == null) return res.status(400).send({err: 'User doesnt exists!'})
    if(validUsername.error) return res.status(400).send({ err: 'Invalid username!'});
    if(existingUser != null) return res.status(400).send({ err: 'User alredy exists!'});

    user.username = username;
    await saveUserObject(user);
    const token = await createToken({ _id: user._id, username: user.username });
    res.header('x-auth', token);
    res.status(200).send('Username changed succesfully!');
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

module.exports =  { publicUserInfo, changeEmail, changePassword, editHandler, changeNormalProperty, changeUsername }
const _ = require('lodash');
const { validateEmail, validatePassword} = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate, saveUserObject } = require('../models/user');
const hash = require('../middleware/hash');


//Addition validation needed 
const editHandler = async(req, res) => {
    let response = {};
    if(!req.body._id) return res.status(400).send({err : 'User id missing!'});

    for(let property of Object.entries(req.body))
        if(property[1] != null && property[0] != '_id' && property[0] != 'username' && property[0] != 'email'){
            response[property[0]] = await changeProperty(req, property[0], ['_id', property[0]]);
        }
    return res.status(200).send(response);
}

const publicUserInfo = async (req, res) => {
    const username = req.params.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        return res.status(409).send({});
    res.status(200).send(_.pick(user, ['username', 'firstname', 'lastname']));  
}

const changeEmail = async (req, res) => {
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
    const { username, password, new_password } = _.pick(req.body, ['username', 'password', 'new_password'])
    const user = await findUserByUsername({ username });
    const validOldPassword = await hash.verifyPassword(password, user.password);
    
    if(!validOldPassword) return res.status(403).send({ err: 'Data provided not valid!' });
    
    const validateNewPassword = validatePassword(new_password);
    if(validateNewPassword.err) return res.status(403).send({ err: 'New password not valid'});

    const hashPassword = await hash.hashPassword(new_password);
    user.password = hashPassword;
    await saveUserObject(user);

    res.status(200).send('Password updated succesfully');
}   
//Schematic approach with simillart functions
const changeNormalProperty  = async (req, res) => {
    const propertyName = req.params.propname;
    const resp = await changeProperty(req, propertyName, ['username', propertyName]);
    if(resp.err) return resp.status(409).send(resp);
    res.status(200).send(resp);
}

const changeProperty = async (req, property, data) => {
    let user = null;
    let updateProperty = {};
    const properties = _.pick(req.body, data);

    updateProperty[property] = properties[property];
    if(data[0] == 'username') user =  await findUserAndUpdate({ username: properties.username }, { ...updateProperty });
    else user = await findUserAndUpdate({ _id: properties._id }, { ...updateProperty });

    if(user == null) return { err: 'Could not find specific users!' }
    return { msg: ' Succesfully changed given property!'}
}

module.exports =  { publicUserInfo, changeEmail, changePassword, editHandler, changeNormalProperty }
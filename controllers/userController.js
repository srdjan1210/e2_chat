const _ = require('lodash');
const { validateEmail, validatePassword} = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate, saveUserObject } = require('../models/user');
const hash = require('../middleware/hash');


//Addition validation needed 
const editHandler = async(req, res) => {
    let response = {};
    if(!req.body.username) return res.status(400).send({err : 'Username missing!'});

    for(let property of Object.entries(req.body))
        if(property[1] != null && property[0] != 'username'){
            response[property[0]] = await changeProperty(req, property[0], ['username', property[0]]);
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
const changeFirstname = async (req, res) => {
    const resp = await changeProperty(req, 'firstname', ['username', 'firstname'])
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeLastname = async (req, res) => {
    const resp = await changeProperty(req, 'lastname', ['username', 'lastname']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeCity = async (req, res) => {
    const resp = await changeProperty(req, 'city', ['username', 'city']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeBirthday = async (req, res) => {
    const resp = await changeProperty(req, 'birthday', ['username', 'birthday']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeNationality = async (req, res) => {
    const resp = await changeProperty(req, 'nationality', ['username', 'nationality']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeBiography = async (req, res) => {
    const resp  = await changeProperty(req, 'biography', ['username', 'biography']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeAdress = async (req, res) => {
    const resp  = await changeProperty(req, 'street_adress', ['username', 'street_adress']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeCountry = async (req, res) => {
    const resp  = await changeProperty(req, 'country', ['username', 'country']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeProvince = async (req, res) => {
    const resp  = await changeProperty(req, 'province_state', ['username', 'province_state']);
    if(resp.err) return resp.status(409).send(resp);
    resp.status(200).send(resp);
}

const changeProperty = async (req, property, data) => {
    const properties = _.pick(req.body, data);
    let updateProperty = {};
    updateProperty[property] = properties[property];
    const user =  await findUserAndUpdate({ username: properties.username }, { ...updateProperty });
    if(user == null) return { err: 'Could not find specific users!' }
    return { msg: ' Succesfully changed given property!'}
}

module.exports =  { publicUserInfo, changeFirstname, changeLastname, changeEmail, changePassword, changeCity,
                    changeCountry, changeNationality, changeAdress, changeBiography, changeProvince, changeBirthday,
                    editHandler }
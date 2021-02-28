const _ = require('lodash');
const { validateEmail, validatePassword} = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate, saveUserObject } = require('../models/user');
const hash = require('../middleware/hash');


const publicUserInfo = async (req, res) => {
    const username = req.params.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        return res.status(409).send({});
    res.status(200).send(_.pick(user, ['username', 'firstname', 'lastname']));  
}

const changeFirstname = async (req, res) => {
    const newFirstname = req.body.firstname;
    const username = req.body.username;
    const user = await findUserAndUpdate({ username }, { firstname: newFirstname });
    if(user == null)
        return res.status(409).send({ err: 'Could not find specific user!' });
    res.status(200).send("Firstname updated succesfully");
}

const changeLastname = async (req, res) => {
    const newLastName = req.body.firstname;
    const username = req.body.username;
    const user = await findUserAndUpdate({ username }, { lastname: newLastName });
    if(user == null)
        return res.status(409).send({ err: 'Could not find specific user!' });
    res.status(200).send('Lastname updated succesfully!');
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

const changeCity = async (req, res) => {
    const { username, city } = _.pick(req.body, ['username', 'city']);
    const user  = await findUserAndUpdate({ username }, { city });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('City updated succesfully!')
}

const changeBirthday = async (req, res) => {
    const { username, birthday } = _.pick(req.body, ['username', 'birthday']);
    const user  = await findUserAndUpdate({ username }, { birthday });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Birthday updated succesfully!')
}

const changeNationality = async (req, res) => {
    const { username, nationality } = _.pick(req.body, ['username', 'nationality']);
    const user  = await findUserAndUpdate({ username }, { nationality });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Nationality updated succesfully!')
}

const changeBiography = async (req, res) => {
    const { username, biography } = _.pick(req.body, ['username', 'biography']);
    const user  = await findUserAndUpdate({ username }, { biography });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Biography updated succesfully!')
}

const changeAdress = async (req, res) => {
    const { username, street_adress } = _.pick(req.body, ['username', 'street_adress']);
    const user  = await findUserAndUpdate({ username }, { street_adress });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Adress updated succesfully!')
}

const changeCountry = async (req, res) => {
    const { username, country } = _.pick(req.body, ['username', 'country']);
    const user  = await findUserAndUpdate({ username }, { country });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Country updated succesfully!')
}

const changeProvince = async (req, res) => {
    const { username, province_state } = _.pick(req.body, ['username', 'province_state']);
    const user  = await findUserAndUpdate({ username }, { province_state });

    if(user == null) return res.status(409).send({ err: 'Could not find specific users!'})
    res.status(200).send('Province updated succesfully!')
}

module.exports =  { publicUserInfo, changeFirstname, changeLastname, changeEmail, changePassword, changeCity,
                    changeCountry, changeNationality, changeAdress, changeBiography, changeProvince, changeBirthday }
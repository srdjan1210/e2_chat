const _ = require('lodash');
const { validateEmail, validatePassword} = require('../controllers/validationController');
const { findUserByUsername, findUserAndUpdate } = require('../models/user');

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
    console.log(req.body);
}





module.exports =  { publicUserInfo, changeFirstname, changeLastname, changeEmail, changePassword }
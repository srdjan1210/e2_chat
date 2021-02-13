const _ = require('lodash');
const { findUserByUsername, saveUserToDatabase } = require('../models/user');

publicUserInfo = async (req, res) => {
    const username = req.params.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        return res.status(204).send({});
    res.status(200).send(_.pick(user, ['username', 'img', 'firstname', 'lastname']));  
}

changeFirstname = (req, res) => {
    const newFirstname = req.body.firstname;
    const username = req.body.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        res.sendStatus(204);
    user.firstname = newFirstname;
    saveUserToDatabase(user).then(saved => {
        if(saved) return res.sendStatus(200);
        res.sendStatus(204);

    }).catch( err => {
       res.status(501).send(err);
    })

}

changeLastname = (req, res) => {
    const lastname = req.body.lastname;
    const username = req.body.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        res.sendStatus(204);
    user.lastname = lastname;
    saveUserToDatabase(user).then(saved => {
        if(saved) return res.sendStatus(200);
        res.sendStatus(204);

    }).catch( err => {
       res.status(501).send(err);
    })
}

changeEmail = (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const username = req.body.username;
    const user = await findUserByUsername({ username });
    if(user == null)
        res.sendStatus(204);
    user.email = email;
    saveUserToDatabase(user).then(saved => {
        if(saved) return res.sendStatus(200);
        res.sendStatus(204);

    }).catch( err => {
       res.status(501).send(err);
    })
}




module.exports =  { publicUserInfo, changeFirstname, changeLastname, changeEmail }
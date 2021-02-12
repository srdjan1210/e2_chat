const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { validateUserData } = require('./validationController');
const { checkIfUserExists, saveUserToDatabase } = require('../models/user');
const { hashPassword } = require('../middleware/hash');



registerUser = async (req, res) => {
    const user = _.pick(req.body,['email', 'username', 'password']);
    trimUserData(user);

    const validated = validateUserData(_.pick(user, ['email', 'username']));  
    if(validated.error) return res.status(409).send({err: validated.error.details[0].message});

    
    const registered = await checkIfUserExists(user);

    if(registered != null) return res.status(409).send({err: "User alredy exists"});

    saveUserToDatabase({
        username: user.username,
        password: await hashPassword(user.password),
        email: user.email,
        created: Date.now(),
        lastActiveAt: null,
        profile_image: {
            data: fs.readFileSync(path.join(__dirname, '../public/uploads/imgs/' + req.file.filename)), 
            contentType: 'image/png'
        }
    }).then(saved => {
        if(saved) return res.send(_.pick(saved,['_id', 'username', 'email']));
    }).catch(err => {
        return res.status(501).send("Database problem!");
    });
}


trimUserData = (user) => {
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.username = user.username.trim();
}




module.exports = { registerUser };
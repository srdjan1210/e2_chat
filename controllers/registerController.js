const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { validateUserData } = require('./validationController');
const { checkIfUserExists, saveUserToDatabase } = require('../models/user');
const { hashPassword } = require('../middleware/hash');
const { trimUserData } = require('../helpers/stringOperations');



registerUser = async (req, res) => {
    const user = _.pick(req.body,['email', 'username', 'password','lastname', 'firstname']);
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
        },
        lastname: user.lastname,
        firstname: user.firstname
    }).then(saved => {
        if(saved) return res.status(201).send(_.pick(saved,['_id', 'username', 'email']));
    }).catch(err => {
        return res.status(501).send({err : "Database problem"});
    });
}




module.exports = { registerUser };
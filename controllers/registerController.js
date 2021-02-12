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
    const validated = validateUserData(user);  
    if(validated.error) {
        res.status(400).send({err: validated.error.details[0].message});
        return;
    }
    
    const registered = await checkIfUserExists(user);
    if(registered != null) {
        res.status(400).send({err: "User alredy exists"});
        return;
    }

    const saved = await saveUserToDatabase({
        username: user.username,
        password: await hashPassword(user.password),
        email: user.email,
        created: Date.now(),
        lastActiveAt: null,
        img: null
        // img: {
        //     data: fs.readFileSync(path.join(__dirname, '../public/uploads/imgs/' + req.file.filename)), 
        //     contentType: 'image/png'
        // }
    });

    if(saved) {
        res.send(_.pick(saved,['_id', 'username', 'email']));
        return;
    }

    res.status(501).send({err: "Something went wrong with saving user to database!"});
   

}


trimUserData = (user) => {
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.username = user.username.trim();
}




module.exports = { registerUser };
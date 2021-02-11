const mongoose = require('mongoose');
const Joi = require('joi');
const hash = require('../middleware/hash');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        maxlength:15,
        unique: true
    },
    password: {
        type: String,
        maxlength: 256
    },
    email: {
        type: String,
        unique: true
    },
    last_active_at: Date,
    created: Date,
    

    profile_image: {
        type: Buffer,
        contentType: String
    }
    
});

const userModel = mongoose.model('User', UserSchema);


checkIfUserExists = async (user) => {
    const data = await userModel.findOne(user);
    console.log(data);
    if(data)
        return data;
    return null;
}

saveUserToDatabase = async (user) => {
    console.log(user);
    const usr = new userModel(user);
    return await usr.save();
    
}


module.exports = { checkIfUserExists, saveUserToDatabase }
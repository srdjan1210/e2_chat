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
        data: Buffer,
        contentType: String
    }, 
    firstname: String,
    lastname: String

    
});

const userModel = mongoose.model('User', UserSchema);


checkIfUserExists = async ({username, email}) => {
    const data = await userModel.findOne({username} || {email});
    if(data)
        return data;
    return null;
}

saveUserToDatabase = async (user) => {
    const usr = new userModel(user);
    return await usr.save();
    
}

findUserByUsername = async ({ username }) => {
    const user = await userModel.findOne({ username });
    return user;
}

findUserById = async ({ _id }) => {
    const result = await userModel.findOne({ _id});
    return result;
}

module.exports = { checkIfUserExists, saveUserToDatabase, findUserByUsername, findUserById }
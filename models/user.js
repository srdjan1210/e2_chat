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
    last_active_at: {
        type: Date,
        default: Date.now
    },
    profile_img_100: {
        data: Buffer,
        contentType: String
    },
    profile_img_300: {
        data: Buffer,
        contentType: String
    },
    created: Date,
    firstname: String,
    lastname: String

    
});

const userModel = mongoose.model('User', UserSchema);


const checkIfUserExists = async ({username, email}) => {
    const data = await userModel.findOne({username} || {email});
    if(data)
        return data;
    return null;
}

const saveUserToDatabase = async (user) => {
    const usr = new userModel(user);
    return await usr.save();
    
}

const findUserByUsername = async ({ username }) => {
    const user = await userModel.findOne({ username });
    return user;
}

const findUserById = async ({ _id }) => {
    const result = await userModel.findOne({ _id});
    return result;
}

const findChatUsers = async (id) => {
    const users = await userModel.find({_id: { $ne: id}}).select('_id username firstname lastname email last_active_at profile_img_100 profile_img_300');
    return users;
}

const setUserActiveTime = async(user) => {
    const result = await userModel.findOne(user);
    result.last_active_at = Date.now();
    await result.save();
}

const findUserAndUpdate = async (user, update) => {
    return await userModel.findOneAndUpdate(user, update);
}



module.exports = { checkIfUserExists, saveUserToDatabase, findUserByUsername, 
                    findUserById, setUserActiveTime, findChatUsers, findUserAndUpdate
                 }
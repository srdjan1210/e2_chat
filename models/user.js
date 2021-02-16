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

findChatUsers = async (id) => {
    const users = await userModel.find({_id: { $ne: id}}).select('_id username firstname lastname email last_active_at profile_img_100 profile_img_300');
    console.log(users);
    return users;
}

setUserActiveTime = async(user) => {
    const result = await userModel.findOne(user);
    result.last_active_at = Date.now();
    await result.save();
}



module.exports = { checkIfUserExists, saveUserToDatabase, findUserByUsername, findUserById, setUserActiveTime, findChatUsers }
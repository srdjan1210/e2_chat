const mongoose = require('mongoose');
const _ = require('lodash')


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
    profile_img_100: String,
    profile_img_300: String,
    birthday: {
        type: String,
        default: ''
    },
    nationality: {
        type: String,
        default: ''
    },
    adress: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    province: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    biography: {
        type: String,
        default: ''
    },
    created: Date,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    }
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

const findUserByUsername = async ({ username }) => await userModel.findOne({ username });
const findUserById = async ({ _id }) =>  await userModel.findOne({ _id});
const findChatUsers = async (id) => await userModel.find({_id: { $ne: id}}).select('_id username firstname lastname email last_active_at profile_img_100 profile_img_300');

const setUserActiveTime = async(user) => {
    const result = await userModel.findOne(user);
    result.last_active_at = Date.now();
    await result.save();
}

const findUserAndUpdate = async (user, update) => await userModel.findOneAndUpdate(user, update);


const setProperties = async (properties, _id) => {
    const user = await findOne({ _id });
    user = {...user, ...properties };
    user.save();
}

const getProperties = async (properties, _id) => {
    const user = await findOne({ _id });
    return _.pick(user, properties);
}

const saveUserObject = async (user) => {
    return await user.save();
}



module.exports = { checkIfUserExists, saveUserToDatabase, findUserByUsername, 
                    findUserById, setUserActiveTime, findChatUsers, findUserAndUpdate,
                    setProperties, saveUserObject
                 }
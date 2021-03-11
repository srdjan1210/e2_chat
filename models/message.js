const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    chatid: mongoose.Schema.Types.ObjectId,
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    msg: String,
    sent: {
        type: Date,
        default: () => Math.floor(Date.now() / 1000)
    },
    last_seen: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const messageModel = mongoose.model('Message', MessageSchema);

const saveMessage = async(content) => {
    const message = new messageModel(content);
    return await message.save();
}

const findMessages = async(chatid) =>  await messageModel.find({ chatid });
const loadMessages = async(chatid, n, k) => await messageModel.find({ chatid }).sort({ createdAt: -1 }).skip(k).limit(n);
const countMessages = async (condition) => await messageModel.countDocuments(condition);
const findSingleMessage = async (condition) => await messageModel.findOne(condition);
const findLastSeenMessage = async (condition) => await messageModel.findOne(condition);
const saveMessageObject = async (message) => await message.save();


module.exports = { findMessages, saveMessage, loadMessages, findSingleMessage,findLastSeenMessage, saveMessageObject }
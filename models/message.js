const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    chatid: mongoose.Schema.Types.ObjectId,
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    msg: String,
    sent: {
        type: Date,
        default: () => Math.floor(Date.now() / 1000)
    }    
}, { timestamps: true });


const messageModel = mongoose.model('Message', MessageSchema);

const saveMessage = async (content) => {
    const message = new messageModel(content);
    return await message.save();
}


const findMessages = async (chatid) => {
    const messages = await messageModel.find({ chatid });
    return messages;
}


const loadMessages = async (chatid, n) => {
    console.log(chatid, n);
    const messages = await messageModel.find({ chatid }).sort({ createdAt: -1}).skip(n * 40).limit(40);
    return messages;
}


module.exports = { findMessages, saveMessage, loadMessages }
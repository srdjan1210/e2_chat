const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    chatid: mongoose.Schema.Types.ObjectId,
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    msg: String,
    sent: {
        type: Date,
        default: Date.now()
    }    
});


const messageModel = mongoose.model('Message', MessageSchema);

const saveMessage = async (content) => {
    const message = new messageModel(content);
    return await message.save();
}


const findMessages = async (chatid) => {
    const messages = await messageModel.find({ chatid });
    return messages;
}

module.exports = { findMessages, saveMessage }
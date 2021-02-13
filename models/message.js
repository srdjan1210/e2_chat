const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    chatid: mongoose.Schema.Types.ObjectId,
    from: mongoose.Schema.Types.ObjectId,
    to: mongoose.Schema.Types.ObjectId,
    content: String,
    sent: {
        type: Date,
        default: Date.now()
    }    
});


const messageModel = mongoose.model('Message', MessageSchema);

const saveMessage = async (content, from, to, chatid) => {
    const message = new messageModel({chatid, from , to , content});
    return await message.save();
}


const findMessages = (chatid) => {
    const messages = await messageModel.find({chatid});
    return messages;
}

module.exports = { findMessages, saveMessage }
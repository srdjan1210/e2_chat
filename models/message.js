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

const saveMessage = async (content) => {
    const message = new messageModel(content);
    return await message.save();
}


const findMessages = async (chatid) => {
    const messages = await messageModel.find({ chatid });
    return messages;
}


const loadMessages = async (chatid, n) => {
    const messages = await messageModel.find({ chatid }).sort({ createdAt: -1}).skip(n * 40).limit(40);
    return messages;
}

const countNewMess = async (chatrooms, userid) => {
    let result = Promise.all(
        chatrooms.map(async chatid => {
            const lastMsg = await messageModel.findOne({ chatid: chatid._id, last_seen: true, to: userid });
            if(lastMsg == null) return { chatid: chatid._id, counted: 0, lastMsg };
            const counted = await messageModel.countDocuments({ to: userid, createdAt:{ $gte: lastMsg.createdAt }, last_seen: false });
            return {  chatid: chatid._id, counted, lastMsg: lastMsg._id };
        })
    );
    return result;
}


module.exports = { findMessages, saveMessage, loadMessages, countNewMess }
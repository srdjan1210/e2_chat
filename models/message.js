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


const findMessages = async(chatid) => {
    const messages = await messageModel.find({ chatid });
    return messages;
}


const loadMessages = async(chatid, n, k) => {
    return await messageModel.find({ chatid }).sort({ createdAt: -1 }).skip(k).limit(n);
}

const countNewMess = async(chatrooms, userid) => {
    let filteredChatrooms = await filterChatroomsWithNoSeenMessages(chatrooms, userid);

    filteredChatrooms = Promise.all(filteredChatrooms.map(async({ chatid, lastMsgId, counted, created, from }) => {
        if (lastMsgId != null)
            counted = await countMessages({ chatid, to: userid, createdAt: { $gt: created } });
        return { from, lastMsgId, counted }
    }));
    return filteredChatrooms;
}

const filterChatroomsWithNoSeenMessages = async(chatrooms, userid) => {
    let tempArray = [];
    for (let chatroom of chatrooms) {
        const lastMsg = await messageModel.findOne({ chatid: chatroom._id, last_seen: true, to: userid });
        if (lastMsg == null) {
            const counted = await countMessages({ chatid: chatroom._id, to: userid });
            let from = await messageModel.findOne({ chatid: chatroom._id, to: userid });
            if (from != null) from = from.from;
            if (counted != 0) tempArray.push({ from, chatid: chatroom._id, counted, lastMsgId: null, created: null });
            continue;
        }

        tempArray.push({ from: lastMsg.from, chatid: chatroom._id, counted: null, lastMsgId: lastMsg._id, created: lastMsg.createdAt });
    }
    return tempArray;
}

const countMessages = async (condition) => {
    return await messageModel.countDocuments(condition);
}

const findSingleMessage = async (criteria) => {
    return await messageModel.find({criteria});
}
const findLastSeenMessage = async (chatid) => {
    return await messageModel.findOne({ chatid, last_seen: true });
}

const saveMessageObject = async (message) => {
    await message.save();
}

module.exports = { findMessages, saveMessage, loadMessages, countNewMess, findSingleMessage,findLastSeenMessage, saveMessageObject }
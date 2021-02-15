const mongoose = require('mongoose');

const ChatRoomSchema = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});


const chatRoomModel = mongoose.model('Chatroom', ChatRoomSchema);

const findOrCreateChatRoom = async (users) => {
    const room = await chatRoomModel.findOne({ users });
    if(room != null)
        return room;
    const newRoom = new chatRoomModel({ users });
    return await newRoom.save();
}

module.exports = { findOrCreateChatRoom }



const mongoose = require('mongoose');

const ChatRoomSchema = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId]
    }
});


const chatRoomModel = mongoose.model('Chatroom', ChatRoomSchema);

const findOrCreateChatRoom = async (users) => {
    const room = await chatRoomModel.findOne({ users: { $all: users }  });
    if(room != null)
        return room;
    const newRoom = new chatRoomModel({ users });
    return await newRoom.save();
}

const findChatroomsThatUseId = async (id) => {
    return await chatRoomModel.find({users: {$all:[id]}}).select('_id');  
}

module.exports = { findOrCreateChatRoom, findChatroomsThatUseId }



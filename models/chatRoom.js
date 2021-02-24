const mongoose = require('mongoose');

const ChatRoomSchema = mongoose.Schema({
    users: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    unseen_messages_1: {
        type: Number,
        default: 0
    },
    unseen_messages_2: {
        type: Number,
        default: 0
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
    return await chatRoomModel.find({users: {$all:[id]}}); 
}

const filterChatroomsWithNoSeenMessages = async(chatrooms, userid) => {
        chatrooms = chatrooms.filter(chatroom => {
            if(chatroom.users[0] != userid && chatroom.unseen_messages_1 > 0) return true;
            else if(chatroom.users[1] != userid && chatroom.unseen_messages_2 > 0) return true;
            else return false;
        });
        console.log(chatrooms);
    return chatrooms.map(chatroom => {
        let from = chatroom.users[0] == userid?chatroom.users[1]: chatroom.users[0];
        if(from == chatroom.users[0]) return { counted: chatroom.unseen_messages_1, from };
        else return { counted: chatroom.unseen_messages_2, from };
    });
}

const saveChatroomObject = async (chatroom) => {
    await chatroom.save();
}

module.exports = { findOrCreateChatRoom, findChatroomsThatUseId, saveChatroomObject,filterChatroomsWithNoSeenMessages }



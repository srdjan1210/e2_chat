const io = require('../app');
const { findOrCreateChatRoom, findChatroomsThatUseId, saveChatroomObject } = require('../models/chatRoom');
const { saveMessage, loadMessages, countNewMess, findSingleMessage, findLastSeenMessage, saveMessageObject } = require('../models/message');
const { checkIfUserExists } = require('../models/user');
let connected = [];

const socketExists = (id) => {
    for(let usr in connected) {
        if(usr.id == id)
            return true;
    }

    return false;
}


module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('new user', async (id, cb) => {
            const chatrooms = await findChatroomsThatUseId(id);
            const counts = await countNewMess(chatrooms, id);
            console.log(counts);
            cb(counts);
            if(!socketExists(id)) connected.push({ socketid: socket.id, id });
            socket.broadcast.emit('user logged', { room: socket.id, id });
        });

        socket.on('join room', async (id, cb) => {
            const channel = connected.filter(usr => usr.id == id);
            if(!channel[0]) return cb(null);
            socket.join(channel[0].socketid);
            cb(channel[0].socketid);
        });

        socket.on('leave room', async (room) => {
            socket.leave(room);
        });

        socket.on('message', async ({ msg, from, to, room}, cb) => {
            console.log('hit');
            const chatroom = await findOrCreateChatRoom([from , to]);
            console.log(chatroom);
            const message = await saveMessage({ msg, from, to, chatid: chatroom._id });
            socket.to(room).emit('new message', { msg, from, id: message._id });
            //await saveChatroomObject(chatroom);
            cb(chatroom.unseen_messages);
        }); 

        socket.on('load messages', async ({ from , to, n, k }, cb) => {
            const chatroom = await findOrCreateChatRoom([from , to]);
            const messages = await loadMessages(chatroom._id, n, k);
            cb(messages);
        }); 

        socket.on('message seen', async ({ from , to }, cb) => {
            console.log(from + '' + to);
            const chatroom = await findOrCreateChatRoom([from , to]);
            chatroom.unseen_messages = 0;
            console.log(chatroom);
            await saveChatroomObject(chatroom);
        });

        socket.on('typing', async ({ to }) => {
            const socketId = connected.fiter(user => to == user.id)[0].socketid;
            socket.to(socketid).emit('typing');
        });

        socket.on('disconnect', () => {
            console.log("disconnected");
            connected = connected.filter(user => socket.id != user.socketid);
            console.log(connected);
        });
    });

}   
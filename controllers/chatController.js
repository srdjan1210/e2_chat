const io = require('../app');
const { findOrCreateChatRoom } = require('../models/chatRoom');
const { saveMessage } = require('../models/message');
const connected = [];

io.on('connection', (socket) => {
    socket.on('new user', (id) => {
        connected.push({socketid: socket.id, id});
    });

    socket.on('new message', async (message, from, to) => {
        const chatroom = await findOrCreateChatRoom([from , to]);
        await saveMessage(message, from , to , chatroom._id);
        const room = connected.filter(user => user.id == to);
        socket.join(room[0].socketid);
        socket.to(room[0].socketid).emit('message', message, from); 
    });

    socket.on('disconnected', () => {
        connected = connnected.filter(user => socket.id != user.socketid);
    });



});
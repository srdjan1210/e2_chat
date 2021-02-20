const io = require('../app');
const { findOrCreateChatRoom } = require('../models/chatRoom');
const { saveMessage, loadMessages } = require('../models/message');
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
        socket.on('new user', (id) => {
            if(!socketExists(id))
                connected.push({ socketid: socket.id, id });
           
            socket.broadcast.emit('user logged', { room: socket.id, id });
        });

        socket.on('join room', async (id, cb) => {
            const channel = connected.filter(usr => usr.id == id);
            if(channel[0]){
                socket.join(channel[0].socketid);
                cb(channel[0].socketid);
            }

            cb(null);
         
        });

        socket.on('leave room', async (room) => {
            socket.leave(room);
        });

        socket.on('message', async ({ msg, from, to, room}, cb) => {
            socket.to(room).emit('new message', { msg, from });
            const chatroom = await findOrCreateChatRoom([from , to]);
            await saveMessage({ msg, from, to, chatid: chatroom._id });
            cb();

        }); 

        socket.on('load messages', async ({ from , to, n }, cb) => {
            const chatroom = await findOrCreateChatRoom([from , to]);
            const messages = await loadMessages(chatroom._id, n );
            cb(messages);
        }); 

        socket.on('disconnect', () => {
            console.log("disconnected");
            connected = connected.filter(user => socket.id != user.socketid);
            console.log(connected);
        });
    });

}   
const io = require('../app');
const { findOrCreateChatRoom } = require('../models/chatRoom');
const { saveMessage } = require('../models/message');
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

           
        });

        socket.on('join room', async (id, callback) => {
            const channel = connected.filter(usr => usr.id == id);
            if(channel[0]){
                socket.join(channel[0].socketid);
                callback(channel[0].socketid);
            }

            callback(null);
         
        });

        socket.on('leave room', async (room) => {
            socket.leave(room);
        });

        socket.on('message', async ({ msg, from, to, room}, callback) => {
            socket.to(room).emit('new message', { msg, from });
            const chatroom = await findOrCreateChatRoom([from , to]);
            await saveMessage({ msg, from, to, chatid: chatroom._id });
            callback();

        }); 

        socket.on('disconnect', () => {
            console.log("disconnected");
            connected = connected.filter(user => socket.id != user.socketid);
            console.log(connected);
        });
    });

}   
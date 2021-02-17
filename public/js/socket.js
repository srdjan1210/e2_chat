Main.Chat.socket;
Main.Chat.socketInit = function() {
    Main.Chat.socket = io();
    const id = Main.User.Info._id;
    const socket = Main.Chat.socket;
    socket.on('connect', () => {
        //User se loguje te dostavlja svoj id
        socket.emit('new user', id);
    });
    socket.on('new message', ({ msg, from }) => {
        console.log(`${from}: ${msg}`);
        //Ovdje ces ti uciniti sta hoces sa porukom i sa idom posiljaoca
    });
}
Main.Chat.socketDisconnect = function() {
    Main.Chat.socket.disconnect();
    Main.Chat.socket = undefined;
}
Main.Chat.sendMessage = function(msg, from, to, room) {
    const socket = Main.Chat.socket;
    socket.emit('message', { msg, from, to, room }, () => {
        console.log(msg);
        //Ovdje mozes realizovati logiku kada je poruka primljena, npr ona kvakica dole sto bude
        //To ces ti bolje znati od mene
    });
}
Main.Chat.joinRoom = function(chatWindow) {
    const id = Main.User.Info._id;
    const socket = Main.Chat.socket;
    socket.emit('join room', id, (room) => {
        chatWindow.setAttribute("data-room", room);
        //Sacuvaj sobu koju dobijes ovdje, pa je prosledjujes dalje
        // kada se bude trebala poruka poslati
    });
}
Main.Chat.leaveRoom = function(room) {
    const socket = Main.Chat.socket;
    socket.emit('leave room', room);
}
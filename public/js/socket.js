Main.Chat.socket;
Main.Chat.socketInit = function() {
    Main.Chat.socket = io();
    const id = Main.User.Info._id;
    const socket = Main.Chat.socket;
    socket.on('connect', () => {
        socket.emit('new user', id);
    });
    socket.on('new message', Main.Chat.displayForeignMessage);
}
Main.Chat.socketDisconnect = function() {
    let socket = Main.Chat.socket;
    if (socket) {
        socket.disconnect();
        socket = undefined;
    }
}
Main.Chat.sendMessage = function(msg, from, to, room) {
    if (msg == "" || !msg) return;
    const socket = Main.Chat.socket;
    socket.emit('message', { msg, from, to, room }, () => {
        Main.Chat.displayOwnMessage({ msg, from, to, room });
    });
}
Main.Chat.joinRoom = function(chatWindow, user_id) {
    const socket = Main.Chat.socket;
    const userid = Main.User.Info._id;

    socket.emit('join room', user_id, (room) => {
        chatWindow.setAttribute("data-room", room);
        //prosledjujes svoj id, korisnikov id i slovo n
        //N sluzi da ucitavas n * 40 poruka
        //Ako smo ukupno poslali 50 poruka i stavis da je 
        //n = 0, tada ucitava prvih 40
        //ako stavis da je n = 1, tada preskace poslednjih 40 
        //i kupi ostalih 10
        this.loadMessages( userid ,user_id, 1);
    });
}
Main.Chat.leaveRoom = function(room) {
    const socket = Main.Chat.socket;
    socket.emit('leave room', room);
}

Main.Chat.loadMessages = function(from, to, n) {
    const socket = Main.Chat.socket;
    socket.emit('load messages', { from, to, n }, (messages) => {
        console.log(messages);
    });
}
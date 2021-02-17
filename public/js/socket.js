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
        let chatWindow = Main.Chat.getChatWindow(to);
        let chatBody = chatWindow.querySelector(".chat-body");
        let chatBlock = document.createElement("div");
        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("own");
        chatBlock.innerHTML = Templates.message(msg, false);
        chatBody.append(chatBlock);
    });
}
Main.Chat.joinRoom = function(chatWindow, user_id) {
    const socket = Main.Chat.socket;
    socket.emit('join room', user_id, (room) => {
        chatWindow.setAttribute("data-room", room);
    });
}
Main.Chat.leaveRoom = function(room) {
    const socket = Main.Chat.socket;
    socket.emit('leave room', room);
}
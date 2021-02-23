Main.Chat.socket;
Main.Chat.socketInit = function() {
    Main.Chat.socket = io();
    const id = Main.User.Info._id;
    const socket = Main.Chat.socket;

    socket.on('user logged', (resp) => {
        let chats = document.querySelectorAll(".chat-window");
        if (chats) {
            chats.forEach((chat, i) => {
                if (chat.getAttribute("data-id") == resp.id) {
                    chat.setAttribute("data-room", resp.room);
                }
            });
        }
    });

    socket.on('connect', () => {
        socket.emit('new user', id, (newMessages) => {
            Main.Chat.newMessages = newMessages;
            if (document.querySelectorAll(".chat-opener")) {
                Main.Home.setMessageNotification(newMessages);
            }
        });
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
    if (msg.trim() == "" || !msg) return;
    const socket = Main.Chat.socket;
    socket.emit('message', { msg, from, to, room }, () => {
        Main.Chat.displayOwnMessage({ msg, from, to, room });
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

Main.Chat.loadMessages = function(from, to, n, k) {
    const socket = Main.Chat.socket;
    let chat = Main.Chat.getChatWindow(to);
    Main.Chat.chatLoadStart(chat);
    socket.emit('load messages', { from, to, n, k }, (resp) => {
        Main.Chat.displayChatHistory(resp, chat, n);
        if (resp && resp.length != 0) {
            chat.setAttribute("data-msgs", n);
        } else {
            chat.setAttribute("data-msgs", n - 1);
        }
    });
}
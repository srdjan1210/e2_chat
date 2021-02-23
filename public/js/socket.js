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

Main.Chat.loadMessages = function(from, to, loadTime) {
    const socket = Main.Chat.socket;
    let chat = Main.Chat.getChatWindow(to);
    Main.Chat.chatLoadStart(chat);
    let k = Main.Chat.getDisplayedMsgNumber(chat) - 1;
    let n = 40;
    if (loadTime == 0 && Main.Chat.getUnseenMsgNumber(to) != 0) {
        n = Main.Chat.getUnseenMsgNumber(to) + 10;
    }
    socket.emit('load messages', { from, to, n, k }, (resp) => {
        //console.log(n, k);
        Main.Chat.displayChatHistory(resp, chat, loadTime);
        if (resp && resp.length != 0) {
            chat.setAttribute("data-msgs", loadTime);
        } else {
            chat.setAttribute("data-msgs", loadTime - 1);
        }
    });
}

Main.Chat.messageSeen = function(message) {
    const socket = Main.Chat.socket;
    socket.emit('message seen', { message }, (resp) => {
        console.log(resp);
    });
}
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
            console.log(newMessages);
            if (document.querySelectorAll(".chat-opener")) {
                Main.Home.setMessageNotification(newMessages);
            }
        });
    });
    socket.on('new message', function({ msg, from }) {
        let chat = Main.Chat.getChatWindow(from);
        //TODO:new msg notification if chat closed or minimized (real time)
        Main.Chat.displayForeignMessage({ msg, from }, false, id);
        Main.Chat.getNotifications(chat);
        if (chat) {
            Main.Chat.messageSeen(chat);
        }
    });
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
    let k = Main.Chat.getDisplayedMsgNumber(chat);
    let n = 40;
    let newMsgNum = Main.Chat.getUnseenMsgNumber(to);
    if (loadTime == 0 && newMsgNum != 0) {
        n = newMsgNum + 10;
        newMsgNum = newMsgNum;
    }
    socket.emit('load messages', { from, to, n, k }, (resp) => {
        Main.Chat.displayChatHistory(resp, chat, loadTime, newMsgNum);
        Main.Chat.messageSeen(chat);
        if (resp && resp.length != 0) {
            chat.setAttribute("data-msgs", loadTime);
        } else {
            chat.setAttribute("data-msgs", loadTime - 1);
        }
    });
}
Main.Chat.messageSeen = function(chat) {
    const socket = Main.Chat.socket;
    const from = Main.User.Info._id;
    if (chat) {
        const to = chat.getAttribute("data-id");
        console.log(chat);
        socket.emit('message seen', { from, to }, (resp) => {
            console.log(resp);
        });
    }
}
Main.Chat.getNotifications = function(chat) {
    const socket = Main.Chat.socket;
    const from = Main.User.Info._id;
    if (chat) {
        const to = chat.getAttribute("data-id");
        socket.emit('update notification', { from, to }, (resp) => {
            console.log(resp);
        });
    }
}
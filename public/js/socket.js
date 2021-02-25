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
            Main.Chat.newMessagesLoaded = true;
            if (document.querySelectorAll(".chat-opener")) {
                Main.Home.setMessageNotification(newMessages);
            }
        });
    });
    socket.on('new message', function({ msg, from }) {
        let chat = Main.Chat.getChatWindow(from);
        Main.Chat.displayForeignMessage({ msg, from }, false, id);
        if (chat && !(chat.classList.contains("hidden"))) {
            Main.Chat.messageSeen(chat);
        } else {
            Main.Chat.getNotifications(from);
        }
    });
    socket.on("typing", ({ userId, typingState }) => {
        console.log(userId, typingState);
        let chat = Main.Chat.getChatWindow(userId);
        if (chat) {
            if (typingState) {
                Main.Chat.displayTypingLabel(chat);
            } else {
                Main.Chat.removeTypingLabel(chat);
            }
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
        socket.emit('message seen', { from, to }, (resp) => {
            console.log(resp);
        });
    }
}
Main.Chat.getNotifications = function(from) {
    const socket = Main.Chat.socket;
    const to = Main.User.Info._id;
    socket.emit('update notification', { to, from }, (resp) => {
        Main.Chat.updateNotifications(from, resp);
    });
}
Main.Chat.userTyping = function(userId, typingState) {
    const socket = Main.Chat.socket;
    const id = Main.User.Info._id;
    console.log(typingState);
    socket.emit("typing", { id: id, otherId: userId, typingState: typingState }, (resp) => {
        console.log(resp);
    });
}
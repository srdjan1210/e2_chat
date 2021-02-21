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
                    //Main.Chat.joinRoom(chat, resp.id);
                    chat.setAttribute("data-room", resp.room);
                }
            });
        }
    });

    socket.on('connect', () => {
        //Dobijas niz koji sadrzi id chata i za svakoga koliko ima novih poruka
        //Ako je lastMsg jednak null, tada ne postoji poslednja vidjena poruka, i tada bi trebao da 
        //Vjerovatno ti posaljem ukupan broj poruka koje postojem ali to cu jos doraditi
        //ovo coutned ti je koliko ima novih poruka, to mozes displayat, a poslata ti je i id poslednje poruke
        socket.emit('new user', id, (newMessages) => {
            console.log(newMessages);
            Main.Chat.newMessages = newMessages;
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

Main.Chat.loadMessages = function(from, to, n) {
    const socket = Main.Chat.socket;
    let chat = Main.Chat.getChatWindow(to);
    Main.Chat.chatLoadStart(chat);
    socket.emit('load messages', { from, to, n }, (resp) => {
        Main.Chat.displayChatHistory(resp, chat, n);
        if (resp && resp.length != 0) {
            chat.setAttribute("data-msgs", n);
        } else {
            chat.setAttribute("data-msgs", n - 1);
        }
    });
}
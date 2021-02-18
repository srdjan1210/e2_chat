Main.Chat = {
    chatCounter: 0,
    init: function() {

    },
    openChatEvent: function(e) {
        let User = Main.getOtherUserInfo(this.getAttribute("data-id"));
        if (!(Main.Chat.checkIfChatOpen(User._id))) {
            if (Main.Chat.chatCounter < jsConfig.maxChatWindows) {
                Main.Chat.createChat(User);
            } else {
                Main.openPopup(`Maximum chat number reached(${jsConfig.maxChatWindows})`);
            }
        }
    },
    createChat: function(User) {
        let chatWindows = document.querySelector("#chat-windows");
        let chatWindow = document.createElement("div");
        let imageUrl = Utility.createImageUrl(User.profile_img_100.data.data);
        Main.Chat.joinRoom(chatWindow, User._id);

        chatWindow.classList.add("chat-window");
        chatWindow.setAttribute("data-id", User._id);
        chatWindow.innerHTML = Templates.chatWindow(User.username, User.firstname, User.lastname, imageUrl);
        chatWindows.prepend(chatWindow);

        Main.Chat.setReadFormEvent(chatWindow);
        Main.Chat.setCloseChatEvent(chatWindow);
        Main.Chat.chatCounter++;
    },
    checkIfChatOpen: function(id) {
        let chats = document.querySelectorAll(".chat-window");
        let chatExists = false;
        if (chats) {
            chats.forEach(function(chat, index) {
                if (chat.getAttribute("data-id") == id) {
                    chatExists = true;
                }
            });
        }
        return chatExists;
    },
    setCloseChatEvent: function(chatWindow) {
        let closeBtn = chatWindow.querySelector(".btn-chat-close");
        closeBtn.addEventListener("click", Main.Chat.closeChatEvent);
    },
    closeChatEvent: function(e) {
        let chatForm = this.closest(".chat-window").querySelector(".chat-form");

        this.removeEventListener("click", Main.Chat.closeChatEvent);
        chatForm.removeEventListener("submit", Main.Chat.readFormEvent);
        this.closest(".chat-window").remove();
        Main.Chat.chatCounter--;
    },
    closeAllChats: function() {
        let chats = document.querySelectorAll(".chat-window");
        if (chats) {
            chats.forEach(function(chat, index) {
                let closeBtn = chat.querySelector(".btn-chat-close");
                closeBtn.removeEventListener("click", Main.Chat.closeChatEvent);
                chat.querySelector(".chat-form").removeEventListener("submit", Main.Chat.readFormEvent);
                chat.remove();
            });
        }
        Main.Chat.chatCounter = 0;
    },
    setReadFormEvent: function(chatWindow) {
        let sendBtn = chatWindow.querySelector(".chat-form");
        sendBtn.addEventListener("submit", Main.Chat.readFormEvent);
    },
    readFormEvent: function(e) {
        e.preventDefault();
        const chatWindow = this.closest(".chat-window");
        const from = Main.User.Info._id;
        const message = this.querySelector(".chat-new-msg").value;
        const to = chatWindow.getAttribute("data-id");
        const room = chatWindow.getAttribute("data-room");
        Main.Chat.sendMessage(message, from, to, room);

        this.querySelector(".chat-new-msg").value = "";
    },
    getChatWindow: function(id) {
        let chatWindows = document.querySelectorAll(".chat-window");
        let chatWindow;
        if (chatWindows) {
            chatWindows.forEach(function(chat, index) {
                if (chat.getAttribute("data-id") == id) {
                    chatWindow = chat;
                }
            });
        }
        return chatWindow;
    },
    displayOwnMessage: function({ msg, from, to, room }) {
        let chatWindow = Main.Chat.getChatWindow(to);
        if (!chatWindow) return;
        let chatBody = chatWindow.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("own");
        chatBlock.innerHTML = Templates.message(msg, false);
        chatBody.append(chatBlock);
        Main.Chat.setChatScroll(chatBody);
    },
    displayForeignMessage: function({ msg, from }) {
        let chatWindow = Main.Chat.getChatWindow(from);
        if (!chatWindow) return;
        let chatBody = chatWindow.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.innerHTML = Templates.message(msg, true);
        chatBody.append(chatBlock);
        Main.Chat.setChatScroll(chatBody);
    },
    setChatScroll: function(chatBody) {
        chatOuter = chatBody.closest(".chat-body-outer");
        delta = chatBody.offsetHeight - chatOuter.offsetHeight;
        if (delta >= 0) {
            chatOuter.scrollTop = delta + 50;
        }
    }
}
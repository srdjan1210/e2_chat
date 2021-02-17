Main.Chat = {
    chatCounter: 0,
    init: function() {
        Main.Chat.socketInit();
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
        chatWindow.classList.add("chat-window");
        chatWindow.setAttribute("data-id", User._id);
        chatWindow.innerHTML = Templates.chatWindow(User.username, User.firstname, User.lastname, imageUrl);
        chatWindows.prepend(chatWindow);
        Main.Chat.setCloseChatEvent(chatWindow);
        Main.Chat.chatCounter++;
        Main.Chat.joinRoom(User._id);
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
        this.removeEventListener("click", Main.Chat.closeChatEvent);
        this.closest(".chat-window").remove();
        Main.Chat.chatCounter--;
    },
    closeAllChats: function() {
        let chats = document.querySelectorAll(".chat-window");
        if (chats) {
            chats.forEach(function(chat, index) {
                let closeBtn = chat.querySelector(".btn-chat-close");
                closeBtn.removeEventListener("click", Main.Chat.closeChatEvent);
                chat.remove();
            });
        }
        Main.Chat.chatCounter = 0;
    }
}
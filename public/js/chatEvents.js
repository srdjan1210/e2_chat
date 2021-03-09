// OPEN CHAT EVENT
Main.Chat.openChatEvent = function(e) {
    e.preventDefault();
    if (this.classList.contains("mini-image-wrapper")) {
        if (this.closest(".sidebar").classList.contains("expanded")) {
            return;
        }
    }

    let chatOpener = this.closest(".chat-opener");
    let User = Main.getOtherUserInfo(chatOpener.getAttribute("data-id"));
    if (!(Main.Chat.checkIfChatOpen(User._id)) && Main.Chat.newMessagesLoaded) {
        if (Main.Chat.chatCounter < jsConfig.maxChatWindows) {
            Main.Chat.createChat(User);
        } else {
            Main.openPopup(`Maximum chat number reached(${jsConfig.maxChatWindows})`);
        }
    }
}

// CLOSE CHAT EVENT
Main.Chat.setCloseChatEvent = function(chatWindow) {
    let closeBtn = chatWindow.querySelector(".btn-chat-close");
    closeBtn.addEventListener("click", Main.Chat.closeChatEvent);
}
Main.Chat.removeCloseChatEvent = function(chatWindow) {
    let closeBtn = chatWindow.querySelector(".btn-chat-close");
    closeBtn.removeEventListener("click", Main.Chat.closeChatEvent);
}
Main.Chat.closeChatEvent = function(e) {
    Main.Chat.closeChat(this.closest(".chat-window"));
}

// SUBMIT FORM EVENT
Main.Chat.setSubmitFormEvent = function(chatWindow) {
    let sendBtn = chatWindow.querySelector(".chat-form");
    sendBtn.addEventListener("submit", Main.Chat.submitFormEvent);
}
Main.Chat.removeSubmitFormEvent = function(chatWindow) {
    let sendBtn = chatWindow.querySelector(".chat-form");
    sendBtn.removeEventListener("submit", Main.Chat.submitFormEvent);
}
Main.Chat.submitFormEvent = function(e) {
    e.preventDefault();
    let chatWindow = this.closest(".chat-window");
    Main.Chat.readForm(chatWindow);
}

// ENTER BUTTON EVENT
Main.Chat.setEnterButtonEvent = function(chatWindow) {
    let textarea = chatWindow.querySelector(".chat-new-msg");
    textarea.addEventListener("keydown", Main.Chat.enterButtonEvent);
}
Main.Chat.removeEnterButtonEvent = function(chatWindow) {
    let textarea = chatWindow.querySelector(".chat-new-msg");
    textarea.removeEventListener("keydown", Main.Chat.enterButtonEvent);
}
Main.Chat.enterButtonEvent = function(e) {
    if (e.keyCode == 13 && !(e.shiftKey)) {
        e.preventDefault();
        let chatWindow = this.closest(".chat-window");
        Main.Chat.readForm(chatWindow);
    }
}

// LOAD MESSAGES EVENT
Main.Chat.setLoadMessagesEvent = function(chat) {
    chat.querySelector(".chat-body-outer").addEventListener("scroll", Main.Chat.loadMessagesEvent);
}
Main.Chat.removeLoadMessagesEvent = function(chat) {
    chat.querySelector(".chat-body-outer").removeEventListener("scroll", Main.Chat.loadMessagesEvent);
}
Main.Chat.loadMessagesEvent = function(e) {
    let chat = this.closest(".chat-window");
    if (this.scrollTop == 0) {
        let nextN = parseInt(chat.getAttribute("data-msgs")) + 1;
        Main.Chat.loadMessages(Main.User.Info._id, chat.getAttribute("data-id"), nextN);
    }
}

// HIDE CHAT EVENT
Main.Chat.setHideChatEvent = function(chatWindow) {
    let header = chatWindow.querySelector(".chat-header-info");
    header.addEventListener("click", Main.Chat.hideChatEvent);
}
Main.Chat.removeHideChatEvent = function(chatWindow) {
    let header = chatWindow.querySelector(".chat-header-info");
    header.removeEventListener("click", Main.Chat.hideChatEvent);
}
Main.Chat.hideChatEvent = function(e) {
    e.preventDefault();
    let chatWindow = this.closest(".chat-window");
    let msgNum = Main.Chat.getUnseenMsgNumber(chatWindow.getAttribute("data-id"));

    if (chatWindow.classList.contains("hidden")) {
        Main.Chat.messageSeen(chatWindow);
        Main.Chat.updateNotifications(chatWindow.getAttribute("data-id"));
        let label = chatWindow.querySelector(".new-label");
        if (label) {
            label.remove();
        }
        let notification = chatWindow.querySelector(".notification-number");
        notification.classList.remove("active");
        Main.Chat.displayNewMessagesLabel(chatWindow, msgNum);
    }
    chatWindow.classList.toggle("hidden");
}

// TYPING EVENT
Main.Chat.setTypingEvent = function(chat) {
    let textarea = chat.querySelector(".chat-new-msg");
    textarea.addEventListener("input", Main.Chat.typingEvent);
}
Main.Chat.removeTypingEvent = function(chat) {
    let textarea = chat.querySelector(".chat-new-msg");
    textarea.removeEventListener("input", Main.Chat.typingEvent);
}
Main.Chat.typingEvent = function(e) {
    let val = this.value.trim();
    let userId = this.closest(".chat-window").getAttribute("data-id");
    if (val == "" && this.classList.contains("typing")) {
        this.classList.remove("typing");
        Main.Chat.userTyping(userId, false);
    } else if (val != "" && !(this.classList.contains("typing"))) {
        this.classList.add("typing");
        Main.Chat.userTyping(userId, true);
    }
}

// EMOJI CONTAINER EVENT
Main.Chat.setOpenEmojisEvent = function(chatWindow) {
    let btn = chatWindow.querySelector(".btn-emoji");
    btn.addEventListener("click", Main.Chat.openEmojiEvent);
}
Main.Chat.removeOpenEmojisEvent = function(chatWindow) {
    let btn = chatWindow.querySelector(".btn-emoji");
    btn.addEventListener("click", Main.Chat.removeEmojiEvent);
}
Main.Chat.openEmojiEvent = function(e) {
    e.preventDefault();
    let container = this.closest(".chat-window").querySelector(".emoji-container");
    container.classList.toggle("active");
}

// EMOJI INSERT EVENTS
Main.Chat.setEmojiInsertEvents = function(chatWindow) {
    let btns = chatWindow.querySelectorAll(".emoji");
    if (btns) {
        btns.forEach(btn => {
            btn.addEventListener("click", Main.Chat.emojiInsertEvents);
        });
    }
}
Main.Chat.removeEmojiInsertEvents = function(chatWindow) {
    let btns = chatWindow.querySelectorAll(".emoji");
    if (btns) {
        btns.forEach(btn => {
            btn.removeEventListener("click", Main.Chat.emojiInsertEvents);
        });
    }
}
Main.Chat.emojiInsertEvents = function(e) {
    e.preventDefault();
    let textarea = this.closest(".chat-window").querySelector(".chat-new-msg");
    let emoji = this.innerHTML;
    textarea.value += emoji;
}
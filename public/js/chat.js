Main.ActiveChats = {
    array: [],
    updateDOM: function(chatWindow) {
        let container = document.querySelector("#chat-windows");
        container.prepend(chatWindow);
    },
    add: function(chatWindow) {
        if (chatWindow) {
            this.array.push(chatWindow);
            this.updateDOM(chatWindow);
            Main.Chat.chatCounter++;
            this.setPositions();
        }
    },
    remove: function(chatWindow) {
        if (chatWindow) {
            let index = this.array.indexOf(chatWindow);
            this.array.splice(index, 1);
            chatWindow.remove();
            Main.Chat.chatCounter--;
            this.setPositions();
        }
    },
    removeAll: function() {
        this.array.forEach((chatWindow, i) => {
            this.remove(chatWindow);
        });
        Main.Chat.chatCounter = 0;
    },
    setPositions: function() {
        this.array.forEach((chatWindow, i) => {
            let offSet = i * (302 + 10) + 10;

            chatWindow.style.right = offSet;
        });
    }
}

Main.Chat = {
    chatCounter: 0,
    newMessagesLoaded: false,
    newMessages: [],
    init: function() {},
    openChatEvent: function(e) {
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
    },
    createChat: function(User) {
        let chatWindow = Main.Chat.createChatWindow(User);

        Main.Chat.joinRoom(chatWindow, User._id);

        Main.ActiveChats.add(chatWindow);
        Main.Chat.loadMessages(Main.User.Info._id, User._id, 0);
        Main.Chat.setChatEvents(chatWindow);
    },
    setChatEvents: function(chatWindow) {
        Main.Chat.setLoadMessagesEvent(chatWindow);
        Main.Chat.setSubmitFormEvent(chatWindow);
        Main.Chat.setCloseChatEvent(chatWindow);
        Main.Chat.setEnterButtonEvent(chatWindow);
        Main.Chat.setHideChatEvent(chatWindow);
        Main.Chat.setTypingEvent(chatWindow);
    },
    createChatWindow: function(User) {
        let chatWindow = document.createElement("div");
        let imageUrl = Utility.createImageUrl(User.profile_img_100.data.data);

        chatWindow.classList.add("chat-window");
        chatWindow.setAttribute("data-id", User._id);
        chatWindow.innerHTML = Templates.chatWindow(User.username, User.firstname, User.lastname, imageUrl);
        return chatWindow;
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
    removeCloseChatEvent: function(chatWindow) {
        let closeBtn = chatWindow.querySelector(".btn-chat-close");
        closeBtn.removeEventListener("click", Main.Chat.closeChatEvent);
    },
    closeChatEvent: function(e) {
        Main.Chat.closeChat(this.closest(".chat-window"));
    },
    closeChat: function(chatWindow) {
        Main.Chat.removeEnterButtonEvent(chatWindow);
        Main.Chat.removeLoadMessagesEvent(chatWindow);
        Main.Chat.removeHideChatEvent(chatWindow);
        Main.Chat.removeCloseChatEvent(chatWindow);
        Main.Chat.removeSubmitFormEvent(chatWindow);
        Main.Chat.removeTypingEvent(chatWindow);

        Main.Chat.userTyping(chatWindow.getAttribute("data-id"), false);

        Main.ActiveChats.remove(chatWindow);
    },
    closeAllChats: function() {
        let chats = document.querySelectorAll(".chat-window");
        if (chats) {
            chats.forEach((chat, i) => {
                Main.Chat.closeChat(chat);
            });
        }
    },
    readForm: function(chatWindow) {
        const from = Main.User.Info._id;
        const message = chatWindow.querySelector(".chat-new-msg").value;
        const to = chatWindow.getAttribute("data-id");
        const room = chatWindow.getAttribute("data-room");
        if (message.trim() == '' || !message) return;
        Main.Chat.sendMessage(message, from, to, room);

        let textarea = chatWindow.querySelector(".chat-new-msg");
        textarea.value = "";
        textarea.classList.remove("typing");
        Main.Chat.userTyping(chatWindow.getAttribute("data-id"), false);
    },
    setSubmitFormEvent: function(chatWindow) {
        let sendBtn = chatWindow.querySelector(".chat-form");
        sendBtn.addEventListener("submit", Main.Chat.submitFormEvent);
    },
    removeSubmitFormEvent: function(chatWindow) {
        let sendBtn = chatWindow.querySelector(".chat-form");
        sendBtn.removeEventListener("submit", Main.Chat.submitFormEvent);
    },
    submitFormEvent: function(e) {
        e.preventDefault();
        let chatWindow = this.closest(".chat-window");
        Main.Chat.readForm(chatWindow);
    },
    setEnterButtonEvent: function(chatWindow) {
        let textarea = chatWindow.querySelector(".chat-new-msg");
        textarea.addEventListener("keydown", Main.Chat.enterButtonEvent);
    },
    removeEnterButtonEvent: function(chatWindow) {
        let textarea = chatWindow.querySelector(".chat-new-msg");
        textarea.removeEventListener("keydown", Main.Chat.enterButtonEvent);
    },
    enterButtonEvent: function(e) {
        if (e.keyCode == 13 && !(e.shiftKey)) {
            e.preventDefault();
            let chatWindow = this.closest(".chat-window");
            Main.Chat.readForm(chatWindow);
        }
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
    displayOwnMessage: function({ msg, from, to, room }, oldMessage, messageId) {
        let chatWindow = Main.Chat.getChatWindow(to);
        if (!chatWindow) return;
        let chatBody = chatWindow.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("message-block");
        if (messageId) chatBlock.setAttribute("data-id", messageId);
        chatBlock.classList.add("own");
        chatBlock.innerHTML = Templates.message(msg, false);
        if (oldMessage == true) {
            chatBody.prepend(chatBlock);
        } else {
            chatBody.append(chatBlock);
            let label = chatWindow.querySelector(".new-label");
            if (label) {
                label.remove();
            }
            Main.Chat.setChatScroll(chatWindow);
        }
    },
    displayForeignMessage: function({ msg, from }, oldMessage, messageId) {
        let chatWindow = Main.Chat.getChatWindow(from);
        if (!chatWindow) return;
        let chatBody = chatWindow.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("message-block");
        if (messageId) chatBlock.setAttribute("data-id", messageId);
        chatBlock.innerHTML = Templates.message(msg, true);
        if (oldMessage == true) {
            chatBody.prepend(chatBlock);
        } else {
            chatBody.append(chatBlock);
            Main.Chat.setChatScroll(chatWindow);
        }
    },
    displayChatHistory(messages, chat, n, newMsgNum) {
        let messageNum = 0;
        if (messages && messages.length != 0) {
            messages.forEach(function(message, index) {
                if (n == 0 || !(Main.Chat.checkIfMessageDisplayed(message, chat))) {
                    messageNum++;
                    if (message.from == Main.User.Info._id) {
                        Main.Chat.displayOwnMessage({ msg: message.msg, from: message.from, to: message.to, room: null }, true, message._id);
                    } else {
                        Main.Chat.displayForeignMessage({ msg: message.msg, from: message.from }, true, message._id);
                    }
                    if (n == 0 && newMsgNum && newMsgNum != 0 && newMsgNum == (index + 1)) {
                        Main.Chat.displayNewMessagesLabel(chat);
                        Main.Chat.updateNotifications(chat.getAttribute("data-id"));
                    }
                }
            });
        }
        Main.Chat.chatLoadEnd(chat);
        if (n == 0) {
            Main.Chat.setChatScroll(chat);
        } else if (messages && messageNum != 0) {
            Main.Chat.setChatScrollAfterLoad(chat, messageNum);
        }
    },
    checkIfMessageDisplayed: function(message, chat) {
        let chatBlocks = chat.querySelectorAll(".chat-block");
        let messageDisplayed = false;
        if (chatBlocks) {
            chatBlocks.forEach(function(chatBlock, i) {
                if (chatBlock.getAttribute("data-id") == message._id) {
                    messageDisplayed = true;
                }
            });
        }
        return messageDisplayed;
    },
    setChatScroll: function(chatWindow) {
        let chatOuter = chatWindow.querySelector(".chat-body-outer");
        let chatBody = chatWindow.querySelector(".chat-body");
        let delta = chatBody.offsetHeight - chatOuter.offsetHeight;
        if (delta >= 0) {
            chatOuter.scrollTop = delta + 50;
        }
    },
    setChatScrollAfterLoad: function(chatWindow, newMessageNum) {
        let chatBlocks = chatWindow.querySelectorAll(".chat-block");
        let chatOuter = chatWindow.querySelector(".chat-body-outer");
        let offSet = 0;
        for (i = 0; i < chatBlocks.length; i++) {
            if (i >= newMessageNum) break;
            let style = chatBlocks[i].currentStyle || window.getComputedStyle(chatBlocks[i]);
            offSet += parseInt(style.marginBottom);
            offSet += parseInt(style.height);
        }
        chatOuter.scrollTop = offSet;
    },
    chatLoadStart: function(chat) {
        let chatBody = chat.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.innerHTML = Templates.chatLoader();
        chatBody.prepend(chatBlock);
    },
    chatLoadEnd: function(chat) {
        chat.querySelector(".chat-loader").closest(".chat-block").remove();
    },
    setLoadMessagesEvent: function(chat) {
        chat.querySelector(".chat-body-outer").addEventListener("scroll", Main.Chat.loadMessagesEvent);
    },
    removeLoadMessagesEvent: function(chat) {
        chat.querySelector(".chat-body-outer").removeEventListener("scroll", Main.Chat.loadMessagesEvent);
    },
    loadMessagesEvent: function(e) {
        let chat = this.closest(".chat-window");
        if (this.scrollTop == 0) {
            let nextN = parseInt(chat.getAttribute("data-msgs")) + 1;
            Main.Chat.loadMessages(Main.User.Info._id, chat.getAttribute("data-id"), nextN);
        }
    },
    setHideChatEvent: function(chatWindow) {
        let header = chatWindow.querySelector(".chat-header-info");
        header.addEventListener("click", Main.Chat.hideChatEvent);
    },
    removeHideChatEvent: function(chatWindow) {
        let header = chatWindow.querySelector(".chat-header-info");
        header.removeEventListener("click", Main.Chat.hideChatEvent);
    },
    hideChatEvent: function(e) {
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
    },
    getDisplayedMsgNumber: function(chat) {
        let messageBlocks = chat.querySelectorAll(".chat-block.message-block");
        if (!messageBlocks) {
            return 0;
        } else {
            return messageBlocks.length;
        }
    },
    getUnseenMsgNumber: function(user_id) {
        let msgs = Main.Chat.newMessages;
        let messageNumber = 0;
        if (msgs) {
            msgs.forEach((msg, i) => {
                if (msg.from == user_id) {
                    messageNumber = msg.counted;
                }
            });
        }
        return messageNumber;
    },
    setUnseenMsgNumber: function(user_id, number) {
        let msgs = Main.Chat.newMessages;
        let exists = false;
        if (msgs) {
            msgs.forEach((msg, i) => {
                if (msg.from == user_id) {
                    msg.counted = number;
                    exists = true;
                }
            });
        }
        if (!exists) {
            msgs.push({ counted: number, from: user_id });
        }
    },
    displayNewMessagesLabel: function(chat, position) {
        let chatBody = chat.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("new-label");
        chatBlock.innerHTML = Templates.newMessageLabel();
        if (position == undefined) {
            chatBody.prepend(chatBlock);
        } else {
            let messageBlocks = chat.querySelectorAll(".chat-block.message-block");
            if (messageBlocks && position) {
                let index = messageBlocks.length - position;
                messageBlocks[index].insertAdjacentHTML('beforebegin', chatBlock.outerHTML);
                Main.Chat.setChatScroll(chat);
            }
        }
    },
    updateNotifications: function(from, number) {
        if (from) {
            if (number) {
                Main.Chat.setUnseenMsgNumber(from, number);
            } else {
                Main.Chat.setUnseenMsgNumber(from, 0);
            }
            Main.Home.setMessageNotification(Main.Chat.newMessages);
            Main.Chat.setHeaderNotifications(Main.Chat.newMessages);
        }
    },
    setHeaderNotifications: function(newMessages) {
        let chats = document.querySelectorAll(".chat-window");
        if (!chats) return;
        if (!newMessages) return;
        chats.forEach((chat, i) => {
            newMessages.forEach((msg, j) => {
                if (msg.counted != 0 && msg.from == chat.getAttribute("data-id")) {
                    let container = chat.querySelector(".notification-number");
                    if (chat.classList.contains("hidden")) {
                        container.innerHTML = msg.counted;
                        container.classList.add("active");
                    } else {
                        container.classList.remove("active");
                    }
                }
            });
        });
    },
    setTypingEvent: function(chat) {
        let textarea = chat.querySelector(".chat-new-msg");
        textarea.addEventListener("input", Main.Chat.typingEvent);
    },
    removeTypingEvent: function(chat) {
        let textarea = chat.querySelector(".chat-new-msg");
        textarea.removeEventListener("input", Main.Chat.typingEvent);
    },
    typingEvent: function(e) {
        let val = this.value.trim();
        let userId = this.closest(".chat-window").getAttribute("data-id");
        if (val == "" && this.classList.contains("typing")) {
            this.classList.remove("typing");
            Main.Chat.userTyping(userId, false);
        } else if (val != "" && !(this.classList.contains("typing"))) {
            this.classList.add("typing");
            Main.Chat.userTyping(userId, true);
        }
    },
    displayTypingLabel: function(chat) {
        let chatBody = chat.querySelector(".chat-body");
        let chatBlock = document.createElement("div");

        chatBlock.classList.add("chat-block");
        chatBlock.classList.add("typing-label");
        chatBlock.innerHTML = Templates.typingLabel();
        chatBody.append(chatBlock);
    },
    removeTypingLabel: function(chat) {
        let label = chat.querySelector(".chat-block.typing-label");
        label.remove();
    }
}
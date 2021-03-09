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
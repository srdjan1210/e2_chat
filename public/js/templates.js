Templates = {
    chatOpener: function(id, username, firstname, lastname, imageUrl) {
        let output =
            `<div data-id="${id}" class="chat-opener">
                <div class="mini-image-wrapper">
                    <div class="mini-image-container" style="background-image:url(${imageUrl});"></div>
                </div>
                <div class="chat-info">
                    <div class="mini-fullname">${firstname} ${lastname}</div>
                    <div class="action-tab">
                        <button class="chat-opener-btn btn-open-chat">
                        <span>chat</span>
                        <div class="notification-number">1</div>
                        </button>
                        <a href="#/home/profile/${username}" class="chat-opener-btn">profile</a>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>`;
        return output;
    },
    chatWindow: function(username, firstname, lastname, imageUrl, emojis) {
        let output =
            `<div class="chat-header nonhighlight">
                <div class="chat-header-info">
                    <div class="chat-image" style="background-image:url(${imageUrl});"></div>
                    <div class="chat-fullname">${firstname} ${lastname}</div>
                    <div class="notification-number"></div>
                </div>
            </div>
            <div class="chat-body-outer">
                <div class="chat-body"></div>
            </div>
            <div class="emoji-container nonhighlight">
                ${this.emojiContainer(emojis)}
            </div>
            <form action="" class="chat-form">
                <textarea class="chat-new-msg" placeholder="write message here..."></textarea>
                <div class="btn-emoji nonhighlight">🙂</div>
                <button type="submit" class="btn-send-msg nonhighlight">
                    <img src="img/send.png"/>
                </button>
            </form>
            <div class="btn-chat-close">
                <div style="transform: rotate(45deg);">+</div>
            </div>`;
        return output;
    },
    message: function(msg, foreign) {
        let output =
            `<div class="message-container">
                <div class="message">${msg}</div>    
            </div>`;
        return output;
    },
    chatLoader: function() {
        let output =
            `<div class="chat-loader"></div>
            <div class="chat-loader-msg">loading old messages...</div>
            <div class="clearfix"></div>`;
        return output;
    },
    newMessageLabel: function() {
        let output =
            `<div class="new-msgs-label">
                new messages
            </div>`;
        return output;
    },
    typingLabel: function() {
        let output =
            `<div class="typing-label-inner">
                user is typing...
            </div>`;
        return output;
    },
    emojiContainer: function(emojis) {
        let output = "";
        if (emojis) {
            emojis.forEach(emoji => {
                output += `<span class="emoji">${emoji}</span>`
            });
        }
        return output;
    },
    createPost: function() {
        let output =
            `<div></div>`;
        return output;
    }
}
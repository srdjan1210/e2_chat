Templates = {
    chatOpener: function(id, username, firstname, lastname, imageUrl) {
        let output =
            //HTML
            `<div data-id="${id}" class="chat-opener">        
                <div class="mini-image-container" style="background-image:url(${imageUrl});"></div>
                <div class="chat-info">
                    <div class="mini-username">${username}</div>
                    <div class="mini-firstname">${firstname}</div>
                    <div class="mini-lastname">${lastname}</div>
                </div>
                <div class="clearfix"></div>
            </div>`
        return output;
    },
    chatWindow: function(username, firstname, lastname, imageUrl) {
        let output =
            `<div class="chat-header">
                <div class="chat-header-info">
                <div class="chat-image" style="background-image:url(${imageUrl});"></div>
                    <div class="chat-fullname">${firstname} ${lastname}</div>
                </div>
            </div>
            <div class="chat-body"></div>
            <form action="" class="chat-form">
                <textarea class="chat-new-msg" placeholder="write message here..."></textarea>
                <input type="submit" class="btn-send-msg" value="Send">
            </form>
            <div class="btn-chat-close">
                <div style="transform: rotate(45deg);">+</div>
            </div>`
        return output;
    }
}
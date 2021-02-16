Templates = {
    chatOpener: function(username, firstname, lastname){
        let output =   
        //HTML
        `<div class="chat-opener">        
            <div class="mini-image-container"></div>
            <div class="chat-info">
                <div class="mini-username">${username}</div>
                <div class="mini-firstname">${firstname}</div>
                <div class="mini-lastname">${lastname}</div>
            </div>
            <div class="clearfix"></div>
        </div>`
        return output;
    }
}
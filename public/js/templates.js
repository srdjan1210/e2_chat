Templates = {
    chatOpener: function(id, username, firstname, lastname, imageUrl){
        let output =   
        //HTML
        `<div id="btn-${id}" class="chat-opener">        
            <div class="mini-image-container" style="background-image:url(${imageUrl});"></div>
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
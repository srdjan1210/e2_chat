let Utility = {
    checkEmail: function(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    createImageUrl: function(buffer) {
        let arrayBufferView = new Uint8Array(buffer);
        let blob = new Blob([arrayBufferView], { type: "image/png" });
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(blob);
        return imageUrl;
    },
    parseMessage: function(msg) {
        return msg.replace(/</g, '&lt').replace('/>/g', '&gt');
    }
}
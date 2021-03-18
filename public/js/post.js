Main.Post = {
    sending: false,
    init: function() {
        this.setCreatePostEvent();
    },
    setCreatePostEvent: function() {
        document.getElementById("create-post-form").addEventListener("submit", Main.Post.createPostEvent);
    },
    createPostEvent: function(e) {
        e.preventDefault();
        let msg = document.getElementById("create-post-msg").value.trim();
        if (!Main.Post.sending && msg && msg != "") {
            let data = {
                userid: Main.User.Info._id,
                content: Utility.parseMessage(msg)
            }
            Main.Post.sendData(data);
        }
    },
    sendData: function(data) {
        this.sending = true;
        fetch(`${jsConfig.domainUrl}/feed/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            console.log(response);
            if (response.status == 200) {
                Main.Post.createPost(data);
            }
            return response.json();
        }).then(function(response) {
            console.log(response);
            this.sending = false;
        }).catch(function(error) {
            console.error(error);
            this.sending = false;
        });
    },
    createPost: function(data) {
        console.log(data);
    }
}
Main.OtherUsers = {
    infoTaken: false,
    Info: {}
}

Main.Home = {
    init: function() {
        window.addEventListener("resize", this.setAvailableUsersHeight);
    },
    displayUserInfo: function() {
        let Info = Main.User.Info;

        document.getElementById("mini-info").innerHTML = Info.username;
        document.getElementById("panel-username").innerHTML = Info.username;
        document.getElementById("panel-firstname").innerHTML = Info.firstname;
        document.getElementById("panel-lastname").innerHTML = Info.lastname;
        document.getElementById("profile-email").innerHTML = Info.email;

        Main.Home.getUsersInfo();

        //this.displayProfileImage();
    },
    displayProfileImage: function(){
        let arrayBufferView = new Uint8Array( Main.User.Info.profile_image.data.data );
        let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL( blob );
        let images = document.querySelectorAll(".image-container");
        images.forEach(function(image, index) {
            image.style.backgroundImage = `url(${imageUrl})`;
        });
    },
    getUsersInfo: function(){
        fetch("http://localhost:3000/home/chatinfo", {
            method: 'POST',
            headers: {
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: {}
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            Main.OtherUsers.Info = response;
            Main.OtherUsers.infoTaken = true;
            console.log(response);
            Main.Home.displayOthers();
            Main.loadEnd();
        }).catch(function(error) {
            console.error(error);
            Main.loadEnd();
        });
    },
    displayOthers: function(){
        let output = "";
        let chatButtons = document.getElementById("chat-openers");
        data = Main.OtherUsers.Info.data;
        if(data){
            data.forEach(function(user, index){
                output += Templates.chatOpener(user.username, user.firstname, user.lastname);
            });
        }
        chatButtons.innerHTML = output;
        this.setAvailableUsersHeight();
    },
    setAvailableUsersHeight: function(e){
        let chats = document.getElementById("chat-openers");
        let nutshell = document.getElementById("user-nutshell");
        chats.style.height = window.innerHeight - nutshell.offsetHeight - 50;
    }
}
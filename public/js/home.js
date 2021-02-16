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
        console.log(Main.User.Info);
        this.displayProfileImage();
    },
    displayProfileImage: function() {
        if (Main.User.Info.profile_img_300.data.data) {
            let imageUrl = Utility.createImageUrl(Main.User.Info.profile_img_300.data.data);
            let images = document.querySelectorAll(".image-container");
            images.forEach(function(image, index) {
                image.style.backgroundImage = `url(${imageUrl})`;
            });
        }
    },
    getUsersInfo: function() {
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
    displayOthers: function() {
        let output = "";
        let chatButtons = document.getElementById("chat-openers");
        data = Main.OtherUsers.Info.data;
        if (data) {
            data.forEach(function(user, index) {
                let imageUrl = Utility.createImageUrl(user.profile_img_100.data.data);
                output += Templates.chatOpener(user._id, user.username, user.firstname, user.lastname, imageUrl);
            });
        }
        chatButtons.innerHTML = output;
        this.setAvailableUsersHeight();
        this.setOpenChatEvents();
    },
    removeOthers: function() {
        let btns = document.querySelectorAll(".chat-opener");
        if (btns) {
            btns.forEach(function(btn, index) {
                btn.removeEventListener("click", Main.Chat.openChatEvent);
                btn.remove();
            });
        }
    },
    setAvailableUsersHeight: function(e) {
        let chats = document.getElementById("chat-openers");
        let nutshell = document.getElementById("user-nutshell");
        chats.style.height = window.innerHeight - nutshell.offsetHeight - 50;
    },
    setOpenChatEvents() {
        let btns = document.querySelectorAll(".chat-opener");
        if (btns) {
            btns.forEach(function(btn, index) {
                btn.addEventListener("click", Main.Chat.openChatEvent);
            });
        }
    }
}
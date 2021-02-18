let Main = {
    init: function() {
        Main.Sections.init();
        Main.Login.init();
        Main.Register.init();
        Main.Home.init();

        this.checkSession();

        document.getElementById("popup-exit").addEventListener("click", this.closePopup);
    },
    checkSession: function() {
        fetch('http://localhost:3000/home/userinfo', {
            method: 'POST',
            headers: {
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: {}
        }).then(function(response) {
            if (response.status == 200) {
                Main.User.logged = true;
            } else {
                Main.User.logged = false;
            }
            return response.json();
        }).then(function(response) {
            if (Main.User.logged) {
                Main.User.Info = response;
                Main.Login.logUser();
                if (Main.OtherUsers.infoTaken) {
                    Main.loadEnd();
                }
                Main.setLoaderOpacity("75%");
            } else {
                Main.loadEnd();
            }
        }).catch(function(error) {
            console.error(error);
            Main.loadEnd();
        });
    },
    loadStart: function() {
        document.getElementById("startup-loader").classList.add("active");
    },
    loadEnd: function() {
        document.getElementById("startup-loader").classList.remove("active");
        this.setLoaderOpacity("75%");
    },
    setLoaderOpacity: function(opacity) {
        let loader = document.querySelector("#startup-loader #blank");
        if (loader.style.opacity != opacity) {
            loader.style.opacity = opacity;
        }
    },
    openPopup: function(msg) {
        document.getElementById("popup-msg").innerHTML = msg;
        document.getElementById("main-popup").classList.add("active");
    },
    closePopup: function(e) {
        e.preventDefault();
        document.getElementById("main-popup").classList.remove("active");
    },
    getOtherUserInfo: function(id) {
        let data = Main.OtherUsers.Info.data;
        let UserData;
        if (data) {
            data.forEach(function(user, index) {
                if (user._id == id) {
                    UserData = user;
                }
            });
        }
        return UserData;
    }
}

Main.User = {
    logged: false,
    Info: {}
}

Main.OtherUsers = {
    infoTaken: false,
    Info: {}
}

document.addEventListener("DOMContentLoaded", function(e) {
    Main.init();
});
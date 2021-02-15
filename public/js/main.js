let Main = {
    init: function () {
        Main.Sections.init();
        Main.Login.init();
        Main.Register.init();
        Main.Home.init();
        this.checkSession();

        document.getElementById("popup-exit").addEventListener("click", this.closePopup);
    },
    checkSession: function () {
        fetch('http://localhost:3000/home/userinfo', {
            method: 'POST',
            headers: {
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: {}
        }).then(function (response) {
            if (response.status == 200) {
                Main.User.logged = true;
            } else {
                Main.User.logged = false;
            }
            return response.json();
        }).then(function (response) {
            if (Main.User.logged) {
                Main.User.Info = response;
                Main.Login.logUser();
            }
            document.getElementById("startup-loader").classList.remove("active");
        }).catch(function (error) {
            console.error(error);
            document.getElementById("startup-loader").classList.remove("active");
        });
    },
    openPopup: function (msg) {
        document.getElementById("popup-msg").innerHTML = msg;
        document.getElementById("main-popup").classList.add("active");
    },
    closePopup: function (e) {
        e.preventDefault();
        document.getElementById("main-popup").classList.remove("active");
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    Main.init();
});
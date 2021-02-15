Main.User = {
    logged: false,
    Info: {}
}

Main.Login = {
    Data: {
        username: "",
        password: ""
    },
    init: function () {
        document.getElementById("log-form").addEventListener("submit", this.formSubmitEvent);
        document.getElementById("btn-logout").addEventListener("click", this.logOut);
    },
    formSubmitEvent: function (e) {
        e.preventDefault();
        if (!(Main.User.logged)) {
            Main.Login.readForm();
            Main.Login.sendData();
        }
    },
    readForm: function () {
        this.Data.username = document.getElementById("log-username").value;
        this.Data.password = document.getElementById("log-password").value;
    },
    sendData: function () {
        console.log(Main.Login.Data);
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Main.Login.Data)
        }).then(function (response) {
            if (response.status == 200) {
                Main.User.logged = true;
            }
            window.localStorage.setItem("e2_chat_token", response.headers.get("x-auth"));
            return response.json();
        }).then(function (response) {
            if (Main.User.logged) {
                Main.User.Info = response;
                Main.Login.logUser();
            } else if (response.err) {
                Main.openPopup(response.err);
            }
        }).catch(function (error) {
            console.error(error);
        });
    },
    logUser() {
        Main.Sections.sectionHandle();
        this.displayUserInfo();
    },
    logOut(e) {
        e.preventDefault();
        Main.User.logged = false;
        Main.User.Info = {};
        window.localStorage.setItem("e2_chat_token", null);
        Main.Sections.sectionHandle("#/login");
    },
    displayUserInfo: function() {
        document.getElementById("mini-info").innerHTML = Main.User.Info.username;
        let arrayBufferView = new Uint8Array( Main.User.Info.profile_image.data.data );
        let blob = new Blob( [ arrayBufferView ], { type: "image/png" } );
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL( blob );
        let images = document.querySelectorAll(".image-container");
        images.forEach(function(image, index) {
            image.style.backgroundImage = `url(${imageUrl})`;
        });
    }
}
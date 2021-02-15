Main.User = {
    logged: false,
    Info: {}
}

Main.Login = {
    Data: {
        username:"",
        password:""
    },
    init: function(){
        document.getElementById("log-form").addEventListener("submit", this.formSubmitEvent);
        document.getElementById("btn-logout").addEventListener("click", this.logOut);
    },
    formSubmitEvent: function(e){
        e.preventDefault();
        if(!(Main.User.logged)){
            Main.Login.readForm();
            Main.Login.sendData(); 
        }
    },
    readForm: function(){
        this.Data.username = document.getElementById("log-username").value;
        this.Data.password = document.getElementById("log-password").value;
    },
    sendData: function(){
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Main.Login.Data)
        }).then(function (response) {
            if(response.status == 200){
                Main.User.logged = true;
            }
            window.localStorage.setItem("e2_chat_token", response.headers.get("x-auth"));
            return response.json();
        }).then(function (response){
            if(Main.User.logged){
                Main.User.Info = response;
                Main.Login.logUser();
            }else if(response.err){
                Main.openPopup(response.err);
            }
        }).catch(function(error) {
            console.error(error);
        });
    },
    logUser(){
        Main.Sections.sectionHandle();
        document.getElementById("mini-info").innerHTML = Main.User.Info.username;
        console.log(Main.User.Info);
    },
    logOut(e){
        e.preventDefault();
        Main.User.logged = false;
        Main.User.Info = {};
        window.localStorage.setItem("e2_chat_token", null);
        Main.Sections.sectionHandle("#/login");
    }
}
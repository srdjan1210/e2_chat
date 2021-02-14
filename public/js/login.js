Main.User = {}

Main.Login = {
    Data: {
        username:"",
        password:""
    },
    init: function(){
        document.getElementById("log-form").addEventListener("submit", this.formSubmitEvent);
    },
    formSubmitEvent: function(e){
        e.preventDefault();
        Main.Login.readForm();
        console.log(Main.Login.Data);
        Main.Login.sendData();
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
            window.localStorage.setItem("e2_chat_token", response.headers.get("x-auth"));
            return response.json();
        }).then(function (response){
            console.log(response);
            if(response._id != null){
                console.log("LOGGED");
                Main.User = response;
                Main.Login.logUser();
            }
        });
    },
    logUser(){
        Main.Sections.sectionHandle("#/home/profile");
    }
}
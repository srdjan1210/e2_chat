Main.Register = {
    Data: {
        firstname:"",
        lastname:"",
        username:"",
        email:"",
        password:""
    },
    init: function(){
        document.getElementById("reg-btn").addEventListener("click", this.formClickEvent);
    },
    formClickEvent: function(e){
        e.preventDefault();
        Main.Register.readForm();
        console.log(Main.Register.Data);
        if(Main.Register.checkData()){
            Main.Register.sendData();
        }
    },
    readForm: function(){
        this.Data.firstname = document.getElementById("reg-firstname").value;
        this.Data.lastname = document.getElementById("reg-lastname").value;
        this.Data.username = document.getElementById("reg-username").value;
        this.Data.email = document.getElementById("reg-email").value;
        this.Data.password = document.getElementById("reg-password").value;
    },
    sendData: function(){
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Main.Register.Data)
        }).then(function (response) {
            return response.json();
        }).then(function (response){
            console.log(response);
        });
    },
    checkData: function(){
        let valid = true;
        if(!(Utility.checkEmail(this.Data.email))){
            let emailInput = document.getElementById("reg-email");
            emailInput.classList.add("invalid");
            emailInput.addEventListener("focus", this.clearErrorEvent);
            valid = false;
        }
        if(this.Data.username.length < 4){
            let usernameInput = document.getElementById("reg-username");
            usernameInput.classList.add("invalid");
            usernameInput.addEventListener("focus", this.clearErrorEvent);
            valid = false;
        }
        if(this.Data.password.length < 8){
            let passwordInput = document.getElementById("reg-password");
            passwordInput.classList.add("invalid");
            passwordInput.addEventListener("focus", this.clearErrorEvent);
            valid = false;
        }
        return valid;
    },
    clearErrorEvent: function(e){
        e.target.classList.remove("invalid");
    }
}
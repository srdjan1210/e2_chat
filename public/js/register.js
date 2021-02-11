Main.Register = {
    init: function(){
        document.getElementById("reg-btn").addEventListener("click", this.formClickEvent);
    },
    formClickEvent: function(e){
        e.preventDefault();

        Main.Register.readForm();
        console.log(Main.Register.info);

        fetch('http://localhost:3000#/register', {
            method: 'post',
            body: Main.Register.info
        }).then(function (response) {
            return response.json();
        }).then(function (response){
            console.log(response);
        });
    },
    info: {
        firstname:"",
        lastname:"",
        username:"",
        email:"",
        password:""
    },
    readForm: function(){
        this.info.firstname = document.getElementById("reg-firstname").value;
        this.info.lastname = document.getElementById("reg-lastname").value;
        this.info.username = document.getElementById("reg-username").value;
        this.info.email = document.getElementById("reg-email").value;
        this.info.password = document.getElementById("reg-password").value;
    }
}
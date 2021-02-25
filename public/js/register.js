Main.Register = {
    Data: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        Image: undefined
    },
    init: function() {
        document.getElementById("reg-form").addEventListener("submit", this.formSubmitEvent);
        document.getElementById("reg-file").addEventListener("change", this.fileInfoEvent);
        let requiredInputs = document.querySelectorAll("#reg-form .required");
        requiredInputs.forEach(function(input, index) {
            input.addEventListener("focus", Main.Register.clearError);
        });
    },
    fileInfoEvent: function(e) {
        let infoElement = document.getElementById("reg-file-info");
        let fileName = document.getElementById("reg-file").files[0].name;
        infoElement.classList.remove("invalid");
        infoElement.innerHTML = fileName;
    },
    formSubmitEvent: function(e) {
        e.preventDefault();
        Main.Register.readForm();
        if ((!(Main.User.logged)) && Main.Register.checkData()) {
            Main.Register.sendData();
        }
    },
    readForm: function() {
        this.Data.firstname = document.getElementById("reg-firstname").value;
        this.Data.lastname = document.getElementById("reg-lastname").value;
        this.Data.username = document.getElementById("reg-username").value;
        this.Data.email = document.getElementById("reg-email").value;
        this.Data.password = document.getElementById("reg-password").value;
        this.Data.Image = document.getElementById("reg-file").files[0];
    },
    sendData: function() {
        let formData = new FormData();
        formData.append("firstname", this.Data.firstname);
        formData.append("lastname", this.Data.lastname);
        formData.append("username", this.Data.username);
        formData.append("email", this.Data.email);
        formData.append("password", this.Data.password);
        formData.append("image", this.Data.Image);
        Main.loadStart();
        fetch(`${jsConfig.domainUrl}/register`, {
            method: 'POST',
            body: formData
        }).then(function(response) {
            return response.json();
        }).then(function(response) {
            if (response.err) {
                Main.openPopup(response.err);
            } else {
                Main.openPopup("Registered successfully");
                Main.Sections.sectionHandle("#/login");
            }
            Main.loadEnd();
        }).catch(function(error) {
            console.error(error);
            Main.loadEnd();
        });
    },
    checkData: function() {
        let valid = true;
        if (!(Utility.checkEmail(this.Data.email))) {
            let emailInput = document.getElementById("reg-email");
            emailInput.classList.add("invalid");
            valid = false;
        }
        if (this.Data.username.length < 4) {
            let usernameInput = document.getElementById("reg-username");
            usernameInput.classList.add("invalid");
            valid = false;
        }
        if (this.Data.password.length < 8) {
            let passwordInput = document.getElementById("reg-password");
            passwordInput.classList.add("invalid");
            valid = false;
        }
        if (!(this.Data.Image)) {
            document.getElementById("reg-file-info").classList.add("invalid");
            valid = false;
        }
        return valid;
    },
    clearError: function(e) {
        e.target.classList.remove("invalid");
    }
}
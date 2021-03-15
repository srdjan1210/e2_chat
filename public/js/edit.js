Main.Edit = {
    init: function() {
        this.clearEditInputs();

        this.setEditEvents();
        document.getElementById("edit-file").addEventListener("change", this.fileInfoEvent);
        document.getElementById("btn-edit-save").addEventListener("click", this.saveEditEvent);
    },
    setInitialData: function() {
        const Info = Main.User.Info;
        let fields = document.querySelectorAll(".edit-value");
        if (fields) {
            fields.forEach(field => {
                if (Info[field.name]) {
                    field.value = Info[field.name];
                }
            });
        }
    },
    clearEditInputs: function() {
        let edits = document.querySelectorAll("section#edit .edit-block");
        if (edits) {
            edits.forEach((edit, i) => {
                let input = edit.querySelector("input");
                input.value = "";
                if (edit.classList.contains("editing") && input.getAttribute("name") != "oldPassword") {
                    edit.classList.remove("editing");
                    input.setAttribute("readonly", "");
                }
            });
        }
    },
    fileInfoEvent: function() {
        let infoElement = document.querySelector("#edit-file-info");
        let fileName = document.querySelector("#edit-file").files[0].name;
        infoElement.innerHTML = fileName;
    },
    setEditEvents: function() {
        let btns = document.querySelectorAll(".edit-block .btn-edit");
        if (btns) {
            btns.forEach((btn, i) => {
                btn.addEventListener("click", this.editEvent);
            });
        }
    },
    editEvent: function(e) {
        e.preventDefault();
        let editBlock = this.closest(".edit-block");
        editBlock.querySelector(".edit-value").removeAttribute("readonly");
        editBlock.classList.add("editing");
    },
    saveEditEvent: function(e) {
        e.preventDefault();
        let Data = Main.Edit.getEditData();

        Main.Edit.checkData(Data);
        Main.Edit.parseData(Data);
    },
    getEditData: function() {
        let Data = {};
        let inputs = document.querySelectorAll(".edit-value");
        if (inputs) {
            inputs.forEach((input, i) => {
                Data[input.name] = input.value.trim();
            });
        }
        Data.image = document.querySelector("#edit-file").files[0];
        return Data;
    },
    checkData: function(Data) {
        let Info = Main.User.Info;
        if (Info.firstname.trim() == Data.firstname) Data.firstname = null;
        if (Info.lastname.trim() == Data.lastname) Data.lastname = null;
        if ((Info.username && Info.username.trim() == Data.username) || Data.username.length > 15 || Data.username.length < 4) Data.username = null;
        if (Info.birthday.trim() == Data.birthday) Data.birthday = null;
        if (Info.nationality.trim() == Data.nationality) Data.nationality = null;
        if (Info.gender.trim() == Data.gender) Data.gender = null;

        if ((Info.email && Info.email.trim() == Data.email) || !Utility.checkEmail(Data.email)) Data.email = null;
        if (Info.street.trim() == Data.street) Data.street = null;
        if (Info.country.trim() == Data.country) Data.country = null;
        if (Info.province.trim() == Data.province) Data.province = null;
        if (Info.city.trim() == Data.city) Data.city = null;
        if (!Data.image) Data.image = null;

        if (Data.newPassword == "" || Data.newPassword != Data.newPassword || Data.newPassword.length > 20 || Data.newPassword.length < 8) Data.newPassword = null;
    },
    parseData: function(Data) {
        let emailData = {};
        let passwordData = {};
        let usernameData = {};
        if (Data.email != null) {
            emailData["email"] = Data.email;
            Main.Edit.sendEmailData(emailData);
        }
        if (Data.newPassword != null) {
            passwordData["password"] = Data.oldPassword;
            passwordData["new_password"] = Data.newPassword;
            Main.Edit.sendPasswordData(passwordData);
        }
        if (Data.username != null) {
            usernameData["username"] = Data.username;
            Main.Edit.sendUsernameData(usernameData);
        }

        let otherData = {
            firstname: Data.firstname,
            lastname: Data.lastname,
            birthday: Data.birthday,
            nationality: Data.nationality,
            gender: Data.gender,
            street: Data.street,
            country: Data.country,
            province: Data.province,
            city: Data.city
        }
        Main.Edit.sendOtherData(otherData);
    },
    closeEditField: function(name) {
        let edits = document.querySelectorAll("section#edit .edit-block");
        if (edits) {
            edits.forEach(edit => {
                let input = edit.querySelector(".edit-value");
                if (input && input.name == name) {
                    edit.classList.remove("editing");
                    input.setAttribute("readonly", "");
                    if (input.name == "newPassword" || input.name == "confirmPassword") {
                        input.value = "";
                    }
                }
            });
        }
    },
    sendEmailData: function(Data) {
        fetch(`${jsConfig.domainUrl}/user/edit/email`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: JSON.stringify(Data)
        }).then((response) => {
            if (response.status == 200) {
                Main.User.Info.email = Data.email;
                Main.Edit.closeEditField("email");
            }
            return response.json();
        }).then((response) => {
            //console.log(response);
        }).catch((error) => {
            console.error(error);
        });
    },
    sendPasswordData: function(Data) {
        fetch(`${jsConfig.domainUrl}/user/edit/password`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: JSON.stringify(Data)
        }).then((response) => {
            if (response.status == 200) {
                Main.Edit.closeEditField("newPassword");
                Main.Edit.closeEditField("confirmPassword");
            }
            return response.json();
        }).then((response) => {
            //console.log(response);
        }).catch((error) => {
            console.error(error);
        });
    },
    sendUsernameData: function(Data) {
        fetch(`${jsConfig.domainUrl}/user/edit/username`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: JSON.stringify(Data)
        }).then((response) => {
            if (response.status == 200) {
                window.localStorage.setItem("e2_chat_token", response.headers.get("x-auth"));
                Main.User.Info.username = Data.username;
                Main.Edit.closeEditField("username");
                Main.Home.displayUser();
            }
            return response.json();
        }).then((response) => {
            //console.log(response);
        }).catch((error) => {
            console.error(error);
        });
    },
    sendFileData: function(Data) {
        //TODO:
    },
    sendOtherData: function(Data) {
        fetch(`${jsConfig.domainUrl}/user/edit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: JSON.stringify(Data)
        }).then((response) => {
            return response.json();
        }).then((response) => {
            let objArr = Object.entries(response);
            if (objArr) {
                objArr.forEach(edit => {
                    Main.User.Info[edit[0]] = edit[1];
                    Main.Edit.closeEditField(edit[0]);
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
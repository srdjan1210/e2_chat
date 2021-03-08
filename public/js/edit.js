Main.Edit = {
    init: function() {
        this.clearEditInputs();

        this.setEditEvents();
        document.getElementById("edit-file").addEventListener("change", this.fileInfoEvent);
        document.getElementById("btn-edit-save").addEventListener("click", this.saveEditEvent);
    },
    setInitialData: function() {
        const Info = Main.User.Info;
        document.querySelector("#edit-firstname-block .edit-value").value = Info.firstname;
        document.querySelector("#edit-lastname-block .edit-value").value = Info.lastname;
        document.querySelector("#edit-username-block .edit-value").value = Info.username;

        document.querySelector("#edit-email-block .edit-value").value = Info.email;
    },
    clearEditInputs: function() {
        let edits = document.querySelectorAll("section#edit .edit-block");
        if (edits) {
            edits.forEach((edit, i) => {
                let input = edit.querySelector("input");
                input.value = "";
                if (edit.classList.contains("editing")) {
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
        if (Info.firstname && Info.firstname.trim() == Data.firstname) Data.firstname = null;
        if (Info.lastname && Info.lastname.trim() == Data.lastname) Data.lastname = null;
        if (Info.username && Info.username.trim() == Data.username) Data.username = null;
        if (Info.birthday && Info.birthday.trim() == Data.birthday) Data.birthday = null;
        if (Info.nationality && Info.nationality.trim() == Data.nationality) Data.nationality = null;
        if (Info.gender && Info.gender.trim() == Data.gender) Data.gender = null;

        if (Info.email && Info.email.trim() == Data.email) Data.email = null;
        if (Info.street && Info.street.trim() == Data.street) Data.street = null;
        if (Info.country && Info.country.trim() == Data.country) Data.country = null;
        if (Info.province && Info.province.trim() == Data.province) Data.province = null;
        if (Info.city && Info.city.trim() == Data.city) Data.city = null;

        if (!Data.image) Data.image = null;

        if (Data.password == "" || Data.password != confirm) Data.password = null;
    },
    parseData: function(Data) {
        let Info = Main.User.Info;
        let emailData = new FormData();
        if (Data.email != null) {
            emailData.append("email", Data.email);
            Main.Edit.sendEmailData(emailData);
        }

        // formData.append("firstname", firstname);
        // formData.append("lastname", lastname);
        // formData.append("username", username);
        // formData.append("birthday", birthday);
        // formData.append("nationality", nationality);
        // formData.append("gender", gender);
        // formData.append("email", email);
        // formData.append("street", street);
        // formData.append("country", country);
        // formData.append("province", province);
        // formData.append("city", city);
        // formData.append("image", image);
        // formData.append("password", password);
        // return formData;
    },
    sendEmailData: function(Data) {
        const token = window.localStorage.getItem("e2_chat_token");
        console.log("email", Array.from(Data));
        fetch(`${jsConfig.domainUrl}/user/edit/email`, {
            method: 'POST',
            headers: {
                'x-auth': token
            },
            body: Data
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.error(error);
        });
    },
    sendData: function(formData) {
        //Main.loadStart();
        fetch(`${jsConfig.domainUrl}/user/edit`, {
            method: 'POST',
            body: formData
        }).then((response) => {
            return response.json();
        }).then((response) => {
            console.log(response);
            //Main.loadEnd();
        }).catch((error) => {
            console.error(error);
            //Main.loadEnd();
        });
    }
}
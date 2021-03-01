Main.Edit = {
    dataChanged: false,
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
        let formData = Main.Edit.getEditData();

        console.log(Array.from(formData));
        Main.Edit.sendData(formData);
    },
    getEditData: function() {
        let Info = Main.User.Info;

        let firstname = document.querySelector("#edit-firstname-block .edit-value").value.trim();
        let lastname = document.querySelector("#edit-lastname-block .edit-value").value.trim();
        let username = document.querySelector("#edit-username-block .edit-value").value.trim();
        let birthday = document.querySelector("#edit-birthday-block .edit-value").value.trim();
        let nationality = document.querySelector("#edit-nationality-block .edit-value").value.trim();
        let gender = document.querySelector("#edit-gender-block .edit-value").value.trim();
        let email = document.querySelector("#edit-email-block .edit-value").value.trim();
        let street = document.querySelector("#edit-street-block .edit-value").value.trim();
        let country = document.querySelector("#edit-country-block .edit-value").value.trim();
        let province = document.querySelector("#edit-province-block .edit-value").value.trim();
        let city = document.querySelector("#edit-city-block .edit-value").value.trim();
        let image = document.querySelector("#edit-image-block #edit-file").files[0];
        let password = document.querySelector("#edit-password-block .edit-value").value.trim();
        let confirm = document.querySelector("#edit-confirm-block .edit-value").value.trim();
        //personal info
        if (Info.firstname && Info.firstname.trim() == firstname) firstname = null;
        if (Info.lastname && Info.lastname.trim() == lastname) lastname = null;
        if (Info.username && Info.username.trim() == username) username = null;
        if (Info.birthday && Info.birthday.trim() == birthday) birthday = null;
        if (Info.nationality && Info.nationality.trim() == nationality) nationality = null;
        if (Info.gender && Info.gender.trim() == gender) gender = null;
        //contact info
        if (Info.email && Info.email.trim() == email) email = null;
        if (Info.street && Info.street.trim() == street) street = null;
        if (Info.country && Info.country.trim() == country) country = null;
        if (Info.province && Info.province.trim() == province) province = null;
        if (Info.city && Info.city.trim() == city) city = null;
        //image
        if (!image) image = null;
        //password
        if (password == "" || password != confirm) password = null;

        let formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("lastname", lastname);
        formData.append("username", username);
        formData.append("birthday", birthday);
        formData.append("nationality", nationality);
        formData.append("gender", gender);
        formData.append("email", email);
        formData.append("street", street);
        formData.append("country", country);
        formData.append("province", province);
        formData.append("city", city);
        formData.append("image", image);
        formData.append("password", password);
        return formData;
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
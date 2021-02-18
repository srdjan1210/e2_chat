Main.Sections = {
    init: function() {
        this.sectionHandle();
        window.addEventListener("hashchange", this.urlChangeEvent);
    },
    sectionHandle: function(customUrl) {
        let location;
        if (customUrl != null) {
            window.location.hash = customUrl;
            location = customUrl;
        } else location = window.location.hash;
        sectionName = location.substring(2).split('/');
        if (Main.User.logged) {
            sectionName[0] = jsConfig.defaultSection[0];
        }
        if (sectionName[0] == jsConfig.defaultSection[0] && (sectionName[1] == "" || !(sectionName[1]))) {
            sectionName[1] = jsConfig.defaultSection[1];
            window.location.hash = jsConfig.defaultUrl;
        };
        if (sectionName[0]) this.sectionMajor(sectionName[0]);
        else this.setDefaultSection();
        if (sectionName[1]) this.sectionMinor(sectionName[1]);
    },
    sectionMajor: function(sectionName) {
        this.sectionChange(sectionName, "section-major");
    },
    sectionMinor: function(sectionName) {
        if (!(document.getElementById("home").classList.contains("active"))) {
            this.setDefaultSection();
            return;
        }
        this.sectionChange(sectionName, "section-minor");
    },
    sectionChange: function(sectionName, sectionType) {
        let section = document.getElementById(sectionName);
        let sections = document.getElementsByClassName(sectionType);
        for (i = 0; i < sections.length; i++) sections[i].classList.remove("active");
        if (section != null && (section.classList.contains(sectionType))) {
            section.classList.add("active");
            document.querySelector("body").scrollTop = 0;
        } else {
            this.setDefaultSection();
        }
    },
    urlChangeEvent: function(e) {
        Main.Sections.sectionHandle();
    },
    setDefaultSection: function() {
        if (!(Main.User.logged)) {
            window.location.hash = "#/login";
            document.getElementById("login").classList.add("active");
        } else {
            window.location.hash = jsConfig.defaultUrl;
            document.getElementById(jsConfig.defaultSection[0]).classList.add("active");
            document.getElementById(jsConfig.defaultSection[1]).classList.add("active");
        }
    }
}
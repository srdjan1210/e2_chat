Main.Sections = {
    init: function(){
        this.sectionHandle();
        window.addEventListener("hashchange", this.urlChangeEvent);
    },
    sectionHandle: function(){
        let location = window.location.hash;
        sectionName = location.substring(2);
        if(sectionName != "") this.sectionChange(sectionName);
        else this.setDefaultSection();
    },
    sectionChange: function(sectionName){
        let section = document.getElementById(sectionName);
        let sections = document.getElementsByTagName("section");
        for(i=0;i<sections.length;i++) sections[i].classList.remove("active");
        if(section!=null){
            section.classList.add("active");
        }else{
            this.setDefaultSection();
        }
    },
    urlChangeEvent: function(e){
        Main.Sections.sectionHandle();
    },
    setDefaultSection: function(){
        window.location.hash = "#/login";
        document.getElementById("login").classList.add("active");
    }
}
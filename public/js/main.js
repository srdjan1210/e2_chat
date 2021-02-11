let Main = {
    init: function(){
        Main.Sections.init();
        Main.Login.init();
        Main.Register.init();
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    Main.init();
});
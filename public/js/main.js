let Main = {
    init: function(){
        Main.Sections.init();
        Main.Login.init();
        Main.Register.init();
        Main.Home.init();
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    Main.init();
});
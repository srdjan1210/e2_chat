Main.otherUsers = {
    infoTaken: false,
    Info: {}
}

Main.Home = {
    init: function() {
        
    },
    getUsersInfo: function(){
        fetch("http://localhost:3000/home/chatinfo", {
            method: 'POST',
            headers: {
                'x-auth': window.localStorage.getItem("e2_chat_token")
            },
            body: {}
        }).then(function(response) {
            console.log(response);
            return response.json();
        }).then(function(response) {
            Main.otherUsers.Info = response;
            Main.otherUsers.infoTaken = true;
            console.log(response);
            Main.Home.displayOthers();
            
            Main.loadEnd();
        }).catch(function(error) {
            console.error(error);
            Main.loadEnd();
        });
    },
    displayOthers: function(){
        let output = "";
        let chatButtons = document.getElementById("chat-openers");
        data = Main.otherUsers.Info.data;
        data.forEach(function(user, index){
            if(user.username.includes("srki")){
                output += `<div class="chat-opener">${user.username} <= peder</div>`
            }else{
                output += `<div class="chat-opener">${user.username}</div>`
            }
        });
        chatButtons.innerHTML = output;
    },
    eraseUserInfo: function(){

    }
}
Main.Chat.socket = io();
Main.Chat.socketInit = function() {
    const id = Math.floor(Math.random() * 100);
    const socket = Main.Chat.socket;
    socket.on('connect', () => {
        //User se loguje te dostavlja svoj id
        socket.emit('new user', id);
    });
    socket.on('new message', ({ msg, from }) => {
        //Ovdje ces ti uciniti sta hoces sa porukom i sa idom posiljaoca
    });
}
Main.Chat.sendMessage = function(msg, from, to, room) {
    const socket = Main.Chat.socket;
    socket.emit('message', { msg, from, to, room }, () => {
        console.log();
        //Ovdje mozes realizovati logiku kada je poruka primljena, npr ona kvakica dole sto bude
        //To ces ti bolje znati od mene
    });
}
Main.Chat.joinRoom = function(id) {
    const socket = Main.Chat.socket;
    console.log(socket);
    console.log(id);
    socket.emit('join room', id, (room) => {
        console.log(room);
        //Sacuvaj sobu koju dobijes ovdje, pa je prosledjujes dalje
        // kada se bude trebala poruka poslati
    });
}
Main.Chat.leaveRoom = function(room) {
    const socket = Main.Chat.socket;
    socket.emit('leave room', room);
}
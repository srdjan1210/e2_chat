const socket = io();

//Promjenjive uzete random, trebas ove obrisati i zamijeniti pravim promjenjivim ili hvatati unutar funkcija
const id = Math.floor(Math.random() * 100);

//Ovdje samo govorim serveru da sam otvorio konekciju,zamijeni samo id sa svojim idom
socket.on('connect', () => {
   //User se loguje te dostavlja svoj id
   socket.emit('new user', id);
});


//Listener za primanje poruka, kad stigne poruka onda ti dolazi sta je u poruci i id korisnika koji ti je poslao
socket.on('new message', ({ msg, from }) => {
    //Ovdje ces ti uciniti sta hoces sa porukom i sa idom posiljaoca
});

//Funkcija za slanje poruke, mozes unutra ubaciti logiku za from to , to su ti tvoj id i onoga kome saljes .
//Mozes implementirati da hvatas te idove odavde a mozes i proslijediti, svejedno je
const sendMessage  = (msg, from, to, room) => {
    socket.emit('message',{ msg, from, to, room }, () => {
        //Ovdje mozes realizovati logiku kada je poruka primljena, npr ona kvakica dole sto bude
        //To ces ti bolje znati od mene
    });
}

//Ovdje se joinujes u sobu, znaci ako meni saljes poruku onda prosledjujes moj id, ne svoj
const joinRoom = (id) => {
    socket.emit('join room', id, (room) => {
        console.log(room);
        //Sacuvaj sobu koju dobijes ovdje, pa je prosledjujes dalje
        // kada se bude trebala poruka poslati
    });
}
//Isto kao i gore, kako se joinujes tako i leavas , samo mi proslijedis sobu kad se ugasi dole chathead
const leaveRoom = (room) => {
    socket.emit('leave room', room);
}



const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const os = require('os');

const Game = require('./model/Game');

let roomsCount = 1;
let playersPerGame = 2;
let games = [];

io.on('connection', socket => {


    socket.on('init', m => {
        let room = "game" + roomsCount;
        games.push(new Game(room, playersPerGame, socket));
        socket.emit("init", {
            room: room
        });

        roomsCount++;
    });

    socket.on('join', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.addPlayer(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('ready',m=>{
        let game = getGameByRoomName(m.room);
        if (game) {
            game.playerIsReady(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('table-ready',m=>{
        let game = getGameByRoomName(m.room);
        if (game) {
            game.tableIsReady(socket)
        } else {
            console.log("requested game does not exists")
        }
    });



    socket.on('next', m => {
        console.log('received next')
        let game = getGameByRoomName(m.room);
        if (game) {
            game.nextStep();
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on("message", m =>{
        console.log(m)
    });

    socket.on("answer", m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.addAnswer(socket, m);
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on("map", m => {
        console.log("Map tag received: "+ m);
        if (m === 1) {
            socket.emit("map-changed", {
                img: 'https://images.ecosia.org/QljWRzschFge6Sg5DthS2uAklcc=/0x390/smart/http%3A%2F%2Fwww.weathergraphics.com%2Fedu%2Fforecastcenter%2Ffc_2010-0304-b.jpg'
            });
        } else if (m === 2) {
            socket.emit("map-changed", {
                img: 'https://images.ecosia.org/dK2oLsumxV_nfXN9_lg9FiNp9tU=/0x390/smart/https%3A%2F%2Faccuweather.brightspotcdn.com%2Fee%2F8e%2Fa49e80424dd4bace863679bab5ee%2Feurope-8-14.jpg'
            });
        } else if (m === 3) {
            socket.emit("map-changed", {
                img: 'https://tse1.mm.bing.net/th?id=OIP.Cu2gKN_R48BSE862JgRIVgHaEb&pid=Api'
            });
        }
    });

    socket.on("ration", m => {
        console.log("Ration tag received: "+ m.id + "  "+ m.player+ "   "+ m.gameRoom);
        if(m.gameRoom !== null) {
            let game = getGameByRoomName(m.gameRoom);
            game.useRation(m);
        }
    })
});



http.listen(4444, function () {
    // Display available adresses
    console.log('Listening on port 4444');
    const ifaces = os.networkInterfaces();
    console.log("Adresses disponibles :");
    Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
                console.log(('  http://' + details.address));
            }
        });
    });
});


function getGameByRoomName(n) {
    let game = null;
    for (let i in games) {
        if (games[i].room === n) {
            game = games[i];
        }
    }
    return game;
}
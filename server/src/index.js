const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const os = require('os');

const Game = require('./model/Game');

let roomsCount = 1;
let playersPerGame = 1;
let games = [];

io.on('connection', socket => {

    socket.on('init', m => {
        let room = "game" + roomsCount;
        games.push(new Game(room, playersPerGame, socket));
        socket.emit("init", {room: room});

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


    socket.on("message", m => {
        console.log(m)
    })
});


http.listen(4444, () => {
    console.log('Listening on port 4444');
});

http.listen(8080, function () {
    // Display available adresses
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
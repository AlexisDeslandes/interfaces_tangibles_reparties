const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


const os = require('os');

const Game = require('./model/Game');


let roomsCount = 1;
let playersPerGame = 4;
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
            game.addPlayer(socket, m)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('ready', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.playerIsReady(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('ask-for-new-part', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.givePuzzlePart(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('updateStats', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            let stats = m.stats;
            let p = game.getPlayerById(socket.id);
            let playerId = p.name;
            let playerJauge = game.jauges[playerId];

            for (let stat of stats) {

                if (playerJauge.hasOwnProperty(stat.type)) {
                    playerJauge[stat.type] = Math.min(parseInt(playerJauge[stat.type]) + stat.value, 10);
                }
            }

        } else {
            console.log("requested game does not exists")
        }

    });

    socket.on('table-ready', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.tableIsReady(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('put-part-of-puzzle', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.playerPuzzleUpdate(socket, m)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('get-puzzle', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.givePuzzle(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('get-player-puzzle-parts', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.sendPuzzleParts(socket)
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('show-puzzle-on-table', m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.showPuzzleToAll();
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on('next', m => {
        console.log('received next');
        let game = getGameByRoomName(m.room);
        if (game) {
            game.nextStep();
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on("message", m => {
        console.log(m)
    });

    socket.on("isTouched", m => {
        console.log(m);
        console.log("Mon message");
        console.log("tuioTag.x >= this._x = " + (m.tag_x >= m.x) + "   " + m.tag_x + ">=" + m.x);
        console.log("tuioTag.x <= this._x + this._width = " + (m.tag_x <= m.x + m._width) + "   " + m.tag_x + "<=" + m.x + "+" + m._width);
        console.log("tuioTag.y >= this._y  = " + (m.tag_y >= m.y) + "   " + m.tag_y + ">=" + m.y);
        console.log("tuioTag.y <= this._y + this._height = " + (m.tag_y <= m.y + m._height) + "   " + m.tag_y + "<=" + m.y + "+" + m._height);
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

        let game = getGameByRoomName(m.gameRoom);
        if (game) {


            game.changeMap(m.id);
        } else {
            console.log("requested game does not exists")
        }

        console.log("Map tag received: " + m);

    });

    socket.on("ration", m => {
        console.log("Ration tag received: " + m.id + "  " + m.player + "   " + m.gameRoom);
        if (m.gameRoom !== null) {
            let game = getGameByRoomName(m.gameRoom);
            game.useRation(m);
        }
    })


    /////////////////////////////////////////////////// GAME /////////////////////////////////////////////////////////////

    socket.on("playerJoin", m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.joinGame(m.player);
        } else {
            console.log("requested game does not exists")
        }
    });

    socket.on("moveRequest", m => {
        let game = getGameByRoomName(m.room);
        if (game) {
            game.makeYouMove(m.player);
        } else {
            console.log("requested game does not exists")
        }
    })

    socket.on("gamePreparation", data => {
        let game = getGameByRoomName(data.room);
        if (game) {
            game.setPlayerData(data.state);
        } else {
            console.log("requested game does not exists")
        }
    })

    socket.on('moveSideRequest', data => {
        let game = getGameByRoomName(data.room);
        if (game) {
            game.moveSideRequest(data.player, data.y);
        } else {
            console.log("requested game does not exists")
        }
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
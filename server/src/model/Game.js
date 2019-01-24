const scenario = require('./scenario');

module.exports = class Game {
    constructor(room, nbPlayers, tableSocket) {
        this.players = [];
        this.gameState = "init";
        this.nbPlayers = nbPlayers;
        this.room = room;
        this.tableSocket = tableSocket;
        this.currentStep = 0;
        this.readyCount = 0;

        this.temperature = 35;
        this.jauges = {};

        this.adventureSteps = scenario;

        console.log("new game created : " + room)
    }

    playerIsReady(socket) {
        let p = this.getPlayerById(socket.id);
        if (p) console.log(p.name + ' is ready');
        this.readyCount++;
        if (this.readyCount === this.nbPlayers) {
            console.log('every player is ready');
            this.nextStep();
        }
    }

    tableIsReady() {
        if (this.players.length > 0) {
            this.nbPlayers = this.players.length;
            this.nextStep();
        } else console.log("can't start a game with 0 players")
    }


    addAnswer(socket, data) {
    }

    addPlayer(socket) {
        if (this.gameState === "init" && !this.alreadyInGame(socket.id)) {

            this.jauges[this.players.length+1] = {"mood": 10, "bike": 10, "chicken": 10, "water": 10, "energy": 10};

            let name = "player " + (this.players.length + 1);
            this.players.push({
                socket: socket,
                name: name,
            });
            console.log(name + " joined " + this.room);
            socket.emit("joined", {message: "You are connected to the server !", player: name, status: 'connected'});
        }
    }

    nextStep() {
        this.readyCount = 0;
        if (this.currentStep === this.adventureSteps.length) {
            console.log(this.room + " is over");
            this.tableSocket.emit("start", {status: 'gameover'}, this.jauges);
            this.sendToAllPlayers("start", {status:'gameover'});

        } else {
            this.gameState = "start";
            this.tableSocket.emit("start", {status: 'start', step: this.adventureSteps[this.currentStep], jauges: this.jauges});
            this.sendToAllPlayers("start", {status: 'start', step: this.adventureSteps[this.currentStep]});
            this.currentStep++;
        }
    }


    sendToAllPlayers(topic, param) {
        this.players.forEach(p => {
            p.socket.emit(topic, param)
        })
    }


    getPlayerById(id) {
        let player = null;
        this.players.forEach(p => {
            if (p.socket.id === id) {
                player = p;
            }
        });
        return player;
    }


    alreadyInGame(id) {
        let found = false;
        this.players.forEach(p => {
            if (p.socket.id === id) {
                found = true;
            }
        });
        return found;
    }

};
const scenario = require('./scenario');
const VeloGame = require('./VeloGame');
const PuzzleManager = require('../model/PuzzleManager');
const MapManager = require('../model/MapManager');


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
        console.log("new game created : " + room);
        this.puzzle = new PuzzleManager(7);
        this.map = new MapManager();
    }

    showPuzzleToAll() {
        this.players.forEach(p => {
            this.puzzle.sendPuzzle(p.socket)
        });
        this.puzzle.sendPuzzle(this.tableSocket)
    }

    showEndedPuzzleToAll() {
        this.players.forEach(p => {
            p.socket.emit('puzzle-ended')
        });
        this.tableSocket.emit('puzzle-ended')
    }


    givePuzzle(socket) {
        this.puzzle.sendPuzzle(socket);
    }

    givePuzzlePart(socket) {
        this.puzzle.getUnrevealedPart(socket);
    }


    sendPuzzleParts(socket) {
        this.puzzle.sendPuzzleParts(socket);
    }

    playerPuzzleUpdate(socket, d) {
        let res = this.puzzle.playerPuzzleUpdate(socket, d);
        if (res === 'ok') {
            this.showPuzzleToAll();
        } else if (res === 'end') {
            this.showEndedPuzzleToAll();
        }
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
            this.veloGame = new VeloGame(this.nbPlayers);
            this.nextStep();
        } else console.log("can't start a game with 0 players")
    }


    addAnswer(socket, data) {
    }

    addPlayer(socket, m) {
        if (this.gameState === "init" && !this.alreadyInGame(socket.id)) {
            this.jauges[this.players.length + 1] = {"mood": 10, "bike": 10, "chicken": 11, "water": 11, "energy": 10};

            this.players.push({
                socket: socket,
                name: m.player,
            });
            console.log('player ' + m.player + " joined " + this.room);
            this.tableSocket.emit("joined", {player: m.player});
            socket.emit("joined", {
                message: "You are connected to the server !",
                player: m.player,
                status: 'connected'
            });
        }
    }

    nextStep() {
        this.readyCount = 0;
        if (this.currentStep === this.adventureSteps.length) {
            console.log(this.room + " is over");
            this.tableSocket.emit("start", {status: 'gameover', jauges: this.jauges});
            this.sendToAllPlayers("start", {status: 'gameover'});
        } else {
            this.gameState = "start";
            this.consumeChickenWater();
            this.tableSocket.emit("start", {
                status: 'start',
                step: this.adventureSteps[this.currentStep],
                jauges: this.jauges
            });
            this.sendToAllPlayers("start", {status: 'start', step: this.adventureSteps[this.currentStep]});
            this.map.refreshStep(this.currentStep);
            this.map.sendProgression(this.tableSocket);
            this.currentStep++;
        }
    }


    consumeChickenWater() {
        for (let playerId in this.jauges) {
            this.jauges[playerId].water--;
            this.jauges[playerId].chicken--;
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

    changeMap(id) {
        this.map.drawArc(id);
        this.map.sendArcs(this.tableSocket);
    }

    useRation(m) {
        if (typeof this.jauges[m.player] !== 'undefined') {
            if (m.id === 'B3') {
                this.jauges[m.player].water += 1;
                this.tableSocket.emit("ration-used", {jauges: this.jauges});
                console.log("Joueur " + m.player + " utilise de l'eau");
            } else if (m.id === 5) {
                this.jauges[m.player].energy += 1;
                this.tableSocket.emit("ration-used", {jauges: this.jauges});
                console.log("Joueur " + m.player + " utilise de l'énergie");

            } else if (m.id === 6) {
                this.jauges[m.player].chicken += 1;
                this.tableSocket.emit("ration-used", {jauges: this.jauges});
                console.log("Joueur " + m.player + " utilise du poulet");

            } else if (m.id === 'B4') {
                this.jauges[m.player].mood += 1;
                this.tableSocket.emit("ration-used", {jauges: this.jauges});
                console.log("Joueur " + m.player + " utilise de l'ectasy");

            } else if (m.id === 8) {
                this.jauges[m.player].bike += 1;
                this.tableSocket.emit("ration-used", {jauges: this.jauges});
                console.log("Joueur " + m.player + " utilise son vélo");
            }
        }
    }

    //////////////////////////////////////////////// Game //////////////////////////////////////////////////////

    joinGame(playerId) {
        const isGameReady = this.veloGame.playerJoin();
        if (isGameReady) {
            this.sendToAllPlayers("veloReady", {status: "veloReady"});
            setTimeout(() => {
                this.tableSocket.emit("askTableDataGame", {playersCount: this.players.length})
            }, 5000)
        } else {
            this.sendToAllPlayers("playerJoinedVelo", {status: "playerJoinedVelo", playerId: playerId})
        }
    }

    makeYouMove(playerId) {
        this.veloGame.makePlayerMove(playerId);
    }

    setPlayerData(state) {
        this.veloGame.setState(state);
        setInterval(() => {
            this.veloGame.generateObstacles()
        }, 1000);
        setInterval(() => {
            this.tableSocket.emit('stateGame', this.veloGame.getState());
            const idPlayerDead = -1;
            this.veloGame.back();
            if (idPlayerDead !== -1) {
                this.sendToPlayer(idPlayerDead, 'dead', {status: 'dead'});
            }
        }, 16)
    }

    moveSideRequest(player, x) {
        this.veloGame.makePlayerMoveSide(player, x);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////

    sendToPlayer(idPlayerDead, topic, object) {
        this.players[idPlayerDead - 1].socket.emit(topic, object);
    }
};
const scenario = require('./scenario');
const VeloGame = require('./VeloGame');
const PuzzleManager = require('./puzzle/PuzzleManager');
const MapManager = require('../model/MapManager');


module.exports = class Game {
    constructor(room, nbPlayers, tableSocket) {
        this.sound = 1;
        this.players = [];
        this.gameState = "init";
        this.nbPlayers = nbPlayers;
        this.dead = [];
        this.room = room;
        this.tableSocket = tableSocket;
        this.currentStep = 0;
        this.readyCount = 0;
        this.jauges = {};
        this.chickenUsed = ["", 0, 0, 0, 0];
        this.waterUsed = ["", 0, 0, 0, 0];
        this.adventureSteps = scenario;
        console.log("new game created : " + room);
        this.puzzle = new PuzzleManager(7);
        this.map = new MapManager();

        this.obstaclesLoop = new Map();
    }

    sound() {
        this.sound = 1 - this.sound;
    }

    showPuzzleToAll(m) {
        this.players.forEach(p => {
            this.puzzle.sendPuzzle(p.socket, m)
        });
        this.puzzle.sendPuzzle(this.tableSocket, m)
    }

    showEndedPuzzleToAll(d) {
        this.players.forEach(p => {
            p.socket.emit('puzzle-ended', {puzzle: d.puzzle})
        });
        this.tableSocket.emit('puzzle-ended', {puzzle: d.puzzle})
    }


    givePuzzle(socket, m) {
        this.puzzle.sendPuzzle(socket, m);
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
            this.showPuzzleToAll(d);
        } else if (res === 'end') {
            this.showEndedPuzzleToAll(d);
        } //else if (res === 'fail') --> notify table
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
            console.log("Nombre de joueurs : " + this.nbPlayers);
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

        for (let playerId in this.jauges)
        {
            let playerJauge = this.jauges[playerId];
            for (let stat in playerJauge)
            {
                if (playerJauge[stat] <= 0) {
                    this.sendToPlayer(playerId, "dead", {"jauge": stat});
                    this.tableSocket.emit("dead", {"playerId": playerId});
                    if (!this.dead.includes(playerId)) {
                        this.dead.push(playerId);
                    }
                }
            }
        }


        this.nbPlayers = this.players.length - this.dead.length;
        if (this.nbPlayers === 0) {
            this.tableSocket.emit("gameover");
        }
        else {
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
    }


    consumeChickenWater() {
        for (let playerId in this.jauges) {
            this.jauges[playerId].water -= 2;
            this.jauges[playerId].chicken -= 2;
        }
    }


    sendToAllPlayers(topic, param) {
        this.players.forEach(p => {
            if (!this.dead.includes(p.name))
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
                if (this.waterUsed[m.player] < 3) {
                    this.jauges[m.player].water += 4;
                    this.jauges[m.player].water = Math.min(10, this.jauges[m.player].water);
                    this.tableSocket.emit("ration-used", {jauges: this.jauges});
                    this.waterUsed[m.player]++;
                    console.log("Joueur " + m.player + " utilise de l'eau");
                }
            } else if (m.id === 6) {
                if (this.chickenUsed[m.player] < 3) {
                    this.jauges[m.player].chicken += 4;
                    this.jauges[m.player].chicken = Math.min(10, this.jauges[m.player].chicken);
                    this.tableSocket.emit("ration-used", {jauges: this.jauges});
                    this.chickenUsed[m.player]++;
                    console.log("Joueur " + m.player + " utilise du poulet");
                }
            }
        }
    }

    //////////////////////////////////////////////// Game //////////////////////////////////////////////////////

    joinGame(playerId) {
        const isGameReady = this.veloGame.playerJoin();
        if (isGameReady) {
            this.sendToAllPlayers("veloReady", {status: "veloReady"});
            setTimeout(() => {
                this.tableSocket.emit("askTableDataGame", {playersCount: this.players.length, state: "game"})
            }, 5000)
        } else {
            this.sendToAllPlayers("playerJoinedVelo", {status: "playerJoinedVelo", playerId: playerId})
        }
    }

    joinGuideline1() {
        const isGameReady = this.veloGame.playerJoin();
        if (isGameReady) {
            this.tableSocket.emit("askTableDataGame", {playersCount: this.players.length, state: "guideline1"});
            this.sendToAllPlayers("guideline1", {status: "guideline1"});
        }
    }

    makeYouMove(playerId) {
        this.veloGame.makePlayerMove(playerId);
    }

    setPlayerData(state) {
        this.veloGame.setState(state);
        let seconds = 8000;
        let tickToWin = 25;

        const generate = () => {
            if (--tickToWin > 0 && this.veloGame.areSurvivantsPresent()) {
                if (seconds > 1000) {
                    seconds -= 500;
                }
                if (tickToWin % 5 === 0) {
                    this.tableSocket.emit('nextAudio', {})
                }
                this.veloGame.generateObstacles();
                setTimeout(generate, seconds);
            } else {
                const playersAlive = this.veloGame.getPlayersAlive();
                playersAlive.forEach(player => {
                    this.sendToPlayer(player, "win", {status: 'win'});
                    this.jauges[player].mood += 2;
                });
                this.tableSocket.emit('clearCanvas', {});
                clearInterval(this.mainInterval);
            }
        };
        setTimeout(generate, seconds);
        this.mainInterval = setInterval(() => {
            this.tableSocket.emit('stateGame', this.veloGame.getState());
            const idPlayerDead = this.veloGame.back(true);
            if (idPlayerDead !== -1) {
                this.jauges[idPlayerDead].bike -= 2;
                this.jauges[idPlayerDead].mood -= 2;
                this.sendToPlayer(idPlayerDead, 'dead', {status: 'dead'});
            }
        }, 16);
    }

    setGuidelinePlayerData(data) {
        this.veloGame.setState(data);
        this.mainInterval = setInterval(() => {
            this.tableSocket.emit('stateGame', this.veloGame.getState());
            this.veloGame.back(false);
        }, 16)
    }

    moveSideRequest(player, x) {
        this.veloGame.makePlayerMoveSide(player, x);
    }

    activateObstacle(player) {
        this.obstaclesLoop.set(player, setInterval(() => {
            this.veloGame.generateObstaclesFor(player)
        }, 2000));
    }

    leaveGame(player) {
        clearInterval(this.obstaclesLoop.get(player));
        const emptyGame = this.veloGame.leaveGame(player);
        if (emptyGame) {
            clearInterval(this.mainInterval);
            this.tableSocket.emit('clean', {});
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////

    sendToPlayer(idPlayer, topic, object) {
        this.players[idPlayer - 1].socket.emit(topic, object);
    }
};
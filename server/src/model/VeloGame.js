const Player = require('./Player');

module.exports = class VeloGame {
    constructor(nbPeople) {
        this.nbPeople = nbPeople;
        this.peopleJoined = 0;
        this.players = [];
        for (let i = 0; i < this.nbPeople; i++) {
            this.players.push(new Player(i + 1));
        }
    }

    leaveGame(playerId){
        this.players[playerId-1].empty();
        this.peopleJoined--;
        console.log(this.peopleJoined);
        return this.peopleJoined === 0;
    }

    playerJoin() {
        return ++this.peopleJoined === this.nbPeople;
    }

    makePlayerMove(playerId) {
        const player = this.players[playerId - 1];
        if (player) {
            this.players[playerId - 1].move();
        }
    }

    getState() {
        return {players: this.players};
    }

    setState(state) {
        for (let i = 0; i < this.players.length; i++) {
            const playerIndex = i + 1;
            const index = "player" + playerIndex;
            const player = state[index];
            this.players[i].x = player.x;
            this.players[i].y = player.y;
            this.players[i].left = player.left;
            this.players[i].leftMax = player.leftMax;
            this.players[i].top = player.top;
            this.players[i].topMax = player.topMax;
        }
    }

    back(provokeDeath) {
        let idToReturn = -1;
        const descente = 1.15;
        const speedObstacle = 3;
        const speed = 45;
        const newPlayers = [];
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            let newObstacles = [];
            let newSpeed = [];
            this.generateSpeed(player);
            switch (player.id) {
                case 1:
                    player.y += descente;
                    for (let obstacle of player.obstacles) {
                        obstacle.y += speedObstacle;
                        if (obstacle.y - 50 < player.topMax) {
                            newObstacles.push(obstacle);
                        }
                    }
                    if (player.isCollision()) {
                        player.y += speedObstacle;
                    }
                    for (let elem of player.speed) {
                        elem.y += speed;
                        if (elem.y < player.topMax) {
                            newSpeed.push(elem);
                        }
                    }
                    break;
                case 2:
                    player.y -= descente;
                    for (let obstacle of player.obstacles) {
                        obstacle.y -= speedObstacle;
                        if (obstacle.y > player.top) {
                            newObstacles.push(obstacle);
                        }
                    }
                    if (player.isCollision()) {
                        player.y -= speedObstacle;
                    }
                    for (let elem of player.speed) {
                        elem.y -= speed;
                        if (elem.y > player.top) {
                            newSpeed.push(elem);
                        }
                    }
                    break;
                case 3:
                    player.x -= descente;
                    for (let obstacle of player.obstacles) {
                        obstacle.x -= speedObstacle;
                        if (obstacle.x > player.left) {
                            newObstacles.push(obstacle);
                        }
                    }
                    if (player.isCollision()) {
                        player.x -= speedObstacle;
                    }
                    for (let elem of player.speed) {
                        elem.x -= speed;
                        if (elem.x > player.left) {
                            newSpeed.push(elem);
                        }
                    }
                    break;
                case 4:
                    player.x += descente;
                    for (let obstacle of player.obstacles) {
                        obstacle.x += speedObstacle;
                        if (obstacle.x - 50 < player.leftMax) {
                            newObstacles.push(obstacle);
                        }
                    }
                    if (player.isCollision()) {
                        player.x += speedObstacle;
                    }
                    for (let elem of player.speed) {
                        elem.x += speed;
                        if (elem.x < player.leftMax) {
                            newSpeed.push(elem);
                        }
                    }
                    break;
                default:
                    console.log('error with back');
                    break;
            }
            player.obstacles = newObstacles;
            player.speed = newSpeed;
            if (player.isDead()) {
                idToReturn = player.id;
            } else {
                newPlayers.push(player);
            }
            if (player.isOutOfMap() && !provokeDeath) {
                switch (player.id) {
                    case 1:
                        player.y = player.topMax - player.size;
                        break;
                    case 2:
                        player.y = player.top;
                        break;
                    case 3:
                        player.x = player.left;
                        break;
                    default:
                        player.x = player.leftMax - player.size;
                        break;
                }
            }
        }
        if (provokeDeath) {
            this.players = newPlayers;
        }
        return idToReturn;
    }

    makePlayerMoveSide(player, x) {
        const realPlayer = this.players[player - 1];
        if (realPlayer) {
            realPlayer.moveSide(x)
        }
    }

    generateObstacles() {
        for (let player of this.players)
            player.generateObstacle();
    }

    generateObstaclesFor(player) {
        this.players[player - 1].generateObstacle();
    }

    generateSpeed(player) {
        player.generateSpeed()
    }
}
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

    playerJoin() {
        return ++this.peopleJoined === this.nbPeople;
    }

    makePlayerMove(playerId) {
        this.players[playerId - 1].move();
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

    back() {
        const descente = 1.15;
        for (let i = 0; i < this.players.length; i++) {
            const player = this.players[i];
            let newObstacles = [];
            switch (i) {
                case 0:
                    if (player.y + descente <= player.topMax) {
                        player.y += descente;
                    }
                    for (let obstacle of player.obstacles) {
                        obstacle.y += descente;
                        if (obstacle.y < player.topMax) {
                            newObstacles.push(obstacle);
                        }
                    }
                    break;
                case 1:
                    if (player.y - descente >= 0) {
                        player.y -= descente;
                    }
                    for (let obstacle of player.obstacles) {
                        obstacle.y -= descente;
                        if (obstacle.y > player.top) {
                            newObstacles.push(obstacle);
                        }
                    }
                    break;
                case 2:
                    if (player.x - descente >= 0) {
                        player.x -= descente;
                    }
                    for (let obstacle of player.obstacles) {
                        obstacle.x -= descente;
                        if (obstacle.x > player.left) {
                            newObstacles.push(obstacle);
                        }
                    }
                    break;
                case 3:
                    if (player.x + descente <= player.leftMax) {
                        player.x += descente;
                    }
                    for (let obstacle of player.obstacles) {
                        obstacle.x += descente;
                        if (obstacle.x < player.leftMax) {
                            newObstacles.push(obstacle);
                        }
                    }
                    break;
                default:
                    console.log('error with back');
                    break;
            }
            player.obstacles = newObstacles;
        }
    }

    makePlayerMoveSide(player, x) {
        this.players[player - 1].moveSide(x);
    }

    generateObstacles() {
        for (let player of this.players)
            player.generateObstacle();
    }

}
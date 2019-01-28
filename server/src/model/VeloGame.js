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
        return this.getState();
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
            console.log(this.players[i]);
        }
    }
}
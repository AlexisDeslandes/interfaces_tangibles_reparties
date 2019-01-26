const Player = require('./Player');

module.exports = class VeloGame {
    constructor(nbPeople) {
        this.nbPeople = nbPeople;
        this.peopleJoined = 0;
        this.players = [];
        for (let i = 0; i < this.nbPeople; i++) {
            this.players.push(new Player(i+1));
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
        return {players:this.players};
    }
}
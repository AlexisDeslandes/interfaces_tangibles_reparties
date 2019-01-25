module.exports = class VeloGame {
    constructor(nbPeople) {
        this.nbPeople = nbPeople;
        this.peopleJoined = 0;
    }

    playerJoin() {
        return ++this.peopleJoined === this.nbPeople;
    }
}
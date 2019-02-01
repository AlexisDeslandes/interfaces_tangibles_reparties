import {Player} from './Player';

export class GameState {

    constructor(playerCount) {
        this.players = [];
        for (let i = 0; i < playerCount; i++) {
            const player = new Player(i + 1);
            this.players.push(player);
        }
    }
}
import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Subject} from "rxjs";

/*
  Generated class for the SocketManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocketManagerProvider {

    state = {};
    stateSubject = new Subject();
    puzzleEnded = false;
    playerColor = "#a22b28";

    room = null;
    player: number;
    nav;

    constructor(public socket: Socket) {

        socket.on("joined", (data) => {
            this.state = data;
            this.emit()
        });

        socket.on("start", (data) => {
            this.state = data;
            this.emit();
        });

        socket.on("playerJoinedVelo", (data) => {
            this.state = data;
            this.emit()
        });

        socket.on("veloReady", (data) => {
            this.state = data;
            this.emit()
        });

        socket.on('dead', (data) => {
            this.state = data;
            this.emit();
        });

        socket.on('guideline1', data => {
            this.state = data;
            this.emit();
        })

    }

    join(room, player) {
        this.player = player;
        this.room = room;
        this.socket.emit('join', {room: room, player: player})
    }

    sendNext() {
        this.socket.emit('next', {room: this.room})
    }

    sendReady() {
        this.socket.emit('ready', {room: this.room})
    }

    emit() {
        this.stateSubject.next(this.state)
    }

    playerJoined() {
        this.socket.emit("playerJoin", {room: this.room, player: this.player})
    }

    sendMoveRequest() {
        this.socket.emit("moveRequest", {room: this.room, player: this.player});
    }

    sendMoveSideRequest(y: number) {
        this.socket.emit("moveSideRequest", {room: this.room, player: this.player, y: y * 10})
    }

    sendGuideline1Ready() {
        this.socket.emit('guideline1', {room: this.room, player: this.player});
    }

    activateObstacle() {
        this.socket.emit('obstacle', {room: this.room, player: this.player});
    }

    leaveGame() {
        this.socket.emit('leaveGame', {room: this.room, player: this.player});
    }
}

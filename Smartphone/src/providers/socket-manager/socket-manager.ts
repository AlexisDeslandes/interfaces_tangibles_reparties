import {Injectable} from '@angular/core';
import {Socket} from "ngx-socket-io";
import {Subject} from "rxjs";
import {App, NavController} from "ionic-angular";
import {DilemmePage} from "../../pages/dilemme/dilemme";
import {GamePage} from "../../pages/game/game";

/*
  Generated class for the SocketManagerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SocketManagerProvider {

    state = {};
    stateSubject = new Subject();

    room = null;
    player;
    nav;

    constructor(public socket: Socket) {

        socket.on("joined", (data) => {
            this.state = data;
            this.emit()
        });

        socket.on("start",(data) => {
            this.state = data;
            this.emit();
        })

    }

    join(room,player){
        this.player = player;
        this.room = room;
        this.socket.emit('join', {room: room, player : player})
    }

    sendNext(){
        this.socket.emit('next',{room:this.room})
    }

    sendReady(){

        this.socket.emit('ready',{room:this.room})
    }


    emit() {
        this.stateSubject.next(this.state)
    }

}

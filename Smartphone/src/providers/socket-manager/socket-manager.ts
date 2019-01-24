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
    nav;

    constructor(public socket: Socket) {

        let url = new URL(document.URL);
        let room = url.searchParams.get("room");
        let player = url.searchParams.get("player");

        if (room && player) {
            this.room = room;
            socket.emit('join', {room: room})
        }
        else {
            console.log('no parameters in URL, not connecting to the server (:')
        }

        socket.on("joined", (data) => {
            this.state = data;
            this.emit()
        });

        socket.on("start",(data) => {

            console.log("RECEIVED START")
            this.state = data;
            this.emit();
        })
    }

    sendNext(){
        console.log("asking for next step",this.room)
        this.socket.emit('next',{room:this.room})
    }


    emit() {
        this.stateSubject.next(this.state)
    }

}

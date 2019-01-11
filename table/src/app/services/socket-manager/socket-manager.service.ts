import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  gameroom = null;

  state = {step: "waiting"};
  stateSubject = new Subject();

  constructor(public socket: Socket) {

    this.emitState();

    socket.on("init", (data) => {
      console.log(data);
      this.gameroom = data.room;
    });

    socket.on("joined", (data) => {
      console.log(data)
    });

    socket.on("start", (data) => {
      this.state.step = "start";
      this.emitState();

    })
  }

  salut() {
    this.socket.emit("message", "salut")
  }

  emitState() {
    this.stateSubject.next(this.state)
  }


  addPlayer(i) {
    if (this.gameroom)
      console.log("player " + i + " joining");
    this.socket.emit("join", {"player": i, "room": this.gameroom})
  }
}

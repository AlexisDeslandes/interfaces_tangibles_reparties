import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  gameroom = null;

  constructor(public socket: Socket) {

    socket.on("init", (data) => {
      console.log(data);
      this.gameroom = data.room;
    });

    socket.on("joined", (data)=>{
      console.log(data)
    });

    socket.on("start", (data)=>{
      console.log("startélélé")
      console.log(data)
    })
  }

  salut() {
    this.socket.emit("message", "salut")
  }


  addPlayer(i) {
    if (this.gameroom)
      console.log("player "+i+" joining");
      this.socket.emit("join",{ "player" : i, "room" : this.gameroom})
  }
}

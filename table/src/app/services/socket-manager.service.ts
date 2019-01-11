import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketManagerService {

  constructor(private socket: Socket) { }

  salut(){
    this.socket.emit("message","salut")
  }

}

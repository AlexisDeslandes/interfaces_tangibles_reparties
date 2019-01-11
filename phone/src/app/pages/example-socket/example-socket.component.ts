import { Component, OnInit } from '@angular/core';
import {SocketManagerService} from "../../services/socket-manager/socket-manager.service";

@Component({
  selector: 'app-example-socket',
  templateUrl: './example-socket.component.html',
  styleUrls: ['./example-socket.component.css']
})
export class ExampleSocketComponent implements OnInit {

  constructor(public socketManager : SocketManagerService) { }

  ngOnInit() {
  }

  salut(){
    console.log("sending salut");
    this.socketManager.salut();
  }

  init(){
    this.socketManager.socket.emit("init",{})
  }

}

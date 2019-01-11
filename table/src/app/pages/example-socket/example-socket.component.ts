import { Component, OnInit } from '@angular/core';
import {SocketManagerService} from "../../../../../phone/src/app/services/socket-manager/socket-manager.service";

@Component({
  selector: 'app-example-socket',
  templateUrl: './example-socket.component.html',
  styleUrls: ['./example-socket.component.css']
})
export class ExampleSocketComponent implements OnInit {

  constructor(private socketManager : SocketManagerService) { }

  ngOnInit() {
  }

  salut(){
    console.log("sending salut");
    this.socketManager.salut();
  }

}

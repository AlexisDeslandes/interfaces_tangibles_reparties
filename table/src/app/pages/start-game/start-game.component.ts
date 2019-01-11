import { Component, OnInit } from '@angular/core';
import {SocketManagerService} from "../../services/socket-manager/socket-manager.service";

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit {

  constructor(public socketManager : SocketManagerService) { }

  ngOnInit() {

  }

}

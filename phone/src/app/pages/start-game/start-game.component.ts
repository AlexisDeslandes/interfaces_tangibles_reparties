import { Component, OnInit } from '@angular/core';
import {SocketManagerService} from "../../services/socket-manager/socket-manager.service";
import {Subscription} from "rxjs/index";
@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.css']
})
export class StartGameComponent implements OnInit {

  state;
  stateSubscription: Subscription;

  constructor(public socketManager : SocketManagerService) {

    this.state = {step: "waiting"};

    this.stateSubscription = this.socketManager.stateSubject.subscribe(data => {
      this.state = data;
      console.log('current state : ',data)
    })
  }

  ngOnInit() {
  }

}

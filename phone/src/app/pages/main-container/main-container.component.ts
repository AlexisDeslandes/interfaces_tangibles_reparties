import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs/index";
import {SocketManagerService} from "../../services/socket-manager/socket-manager.service";

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  state;
  stateSubscription: Subscription;

  constructor(public socketManager: SocketManagerService) {

    this.state = {step: "waiting"};

    this.stateSubscription = this.socketManager.stateSubject.subscribe(data => {
      this.state = data;
      console.log('current state : ', data)
    })
  }

  ngOnInit() {
  }

}

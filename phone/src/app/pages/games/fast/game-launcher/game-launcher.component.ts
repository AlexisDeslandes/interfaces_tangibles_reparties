import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game-launcher',
  templateUrl: './game-launcher.component.html',
  styleUrls: ['./game-launcher.component.css']
})
export class GameLauncherComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {

  }

  ready() {
    this.messageEvent.emit("next");
  }

}

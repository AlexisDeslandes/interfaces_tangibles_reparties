import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<string>();
  playersCount: number = 0;
  start: number = 5;

  constructor() {
  }

  ngOnInit() {
    this.begin();
  }

  begin() {
    const interval = setInterval(() => {
      this.start -= 1;
      if (this.start === 0) {
        this.messageEvent.emit("next");
        clearInterval(interval);
      }
    }, 1000);
  }

}

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-manager',
  templateUrl: './game-manager.component.html',
  styleUrls: ['./game-manager.component.css']
})
export class GameManagerComponent implements OnInit {

  indexVisible : number = 0;

  constructor() {

  }

  ngOnInit() {

  }

  receiveMessage($event){
    this.indexVisible++;
  }

}

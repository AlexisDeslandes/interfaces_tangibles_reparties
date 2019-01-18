import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tapping',
  templateUrl: './tapping.component.html',
  styleUrls: ['./tapping.component.css']
})
export class TappingComponent implements OnInit {

  onLeft: boolean = true;
  count: number = 0;

  constructor() {
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  ngOnInit() {
    this.change_target(true);
  }

  change_target(left: boolean) {
    const page: HTMLElement = document.getElementById("page");
    const target: HTMLElement = document.getElementById("target");
    let xMin;
    let xMax;
    if (left) {
      xMin = 0;
      xMax = page.clientWidth / 2;
    } else {
      xMin = page.clientWidth / 2;
      xMax = page.clientWidth / 2;
    }
    const width: number = this.getRandomInt(xMax - 100) + xMin;
    target.style.left = width + "px";
    target.style.top = this.getRandomInt(page.clientHeight - 100) + "px";
    this.count++;
    this.onLeft = !this.onLeft;
  }

  next_target() {
    this.change_target(this.onLeft);
  }
}

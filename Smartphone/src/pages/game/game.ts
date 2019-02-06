import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Guideline2Page} from "../guideline2/guideline2";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Gyroscope} from "@ionic-native/gyroscope";
import {ReadyPage} from "../ready/ready";

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  private isRolling: boolean = false;
  private intervals: number[] = [];
  private sendLeft: boolean = false;
  private sendRight: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: SocketManagerProvider) {
    Gyroscope.watch({frequency: 32}).subscribe(value => {
      this.socket.sendMoveSideRequest(value.y);
    });
  }

  private rolling(background) {
    let original: boolean = true;
    this.intervals.push(setInterval(() => {
      if (original) {
        background.classList.remove("nine-row");
        background.classList.add("nine-row-2");
      } else {
        background.classList.remove("nine-row-2");
        background.classList.add("nine-row");
      }
      original = !original;
    }, 200));
    this.intervals.push(setInterval(() => {
      this.triggerSpeed(background);
      this.moveSand();
    }, 25));
    this.isRolling = true;
  }

  ionViewDidLoad() {
    const slider = document.getElementById("slidr");
    const slider2 = document.getElementById("slidr2");
    const slide = document.getElementById("slid");
    const slide2 = document.getElementById("slid2");
    const background = document.getElementById("background2");
    const width: number = slider.clientWidth;
    const startY: number = slider.offsetTop;
    const goalY: number = slider.clientHeight + startY - width;
    slide.style.width = width + "px";
    slide.style.height = width + "px";
    slide.ontouchmove = (e) => {
      if (!this.isRolling) {
        this.rolling(background);
      }
      this.onSlideMove(e, width, slide, goalY, background, slider, slider2, slide2, startY, true);
    };
    slide2.ontouchmove = (e) => {
      if (!this.isRolling) {
        this.intervals.push(setInterval(() => {
          this.triggerSpeed(background);
          this.moveSand();
        }, 50));
        this.isRolling = true;
      }
      this.onSlideMove(e, width, slide2, goalY, background, slider2, slider, slide, startY, false);
    }
  }

  onSlideMove(e, width, slide, goalY, background, slider, slider2, slide2, startY, left) {
    const y = e.touches[0].clientY;
    const trueY = y - width / 2;
    if (trueY > startY && trueY < goalY) {
      slide.style.top = trueY + "px";
    }
    if (trueY > goalY) {
      slider.classList.remove("visible");
      slider.classList.add("invisible");
      slider2.classList.remove("invisible");
      slider2.classList.add("visible");
      slide2.style.width = width + "px";
      slide2.style.height = width + "px";
      slide.style.top = startY + "px";
      if ((left && !this.sendLeft) || (!left && !this.sendRight)) {
        this.sendMoveRequest();
        this.sendLeft = left;
        this.sendRight = !left;
      }
    }
  }

  private moveSand() {
    const sable: HTMLImageElement = <HTMLImageElement>document.getElementById("sabl");
    const sable2: HTMLImageElement = <HTMLImageElement>document.getElementById("sabl2");
    const topSable: number = (parseInt(sable.style.top.split("p")[0]) - 10);
    const topSable2: number = (parseInt(sable2.style.top.split("p")[0]) - 10);
    sable.style.top = topSable + "px";
    sable2.style.top = topSable2 + "px";
    if (topSable === -20) {
      sable.style.top = "20px";
    }
    if (topSable2 === -20) {
      sable2.style.top = "20px";
    }
  }

  private triggerSpeed(background: HTMLElement) {
    const getRandomInt: (max: number) => number = (max) => Math.floor(Math.random() * Math.floor(max));
    const speed: HTMLImageElement = document.createElement("img");
    speed.src = "../assets/imgs/speed.svg";
    const widthTotal: number = document.body.clientWidth;
    const heightTotal: number = document.body.clientHeight;
    speed.style.position = "absolute";
    speed.style.left = getRandomInt(widthTotal) + "px";
    speed.style.top = "0px";
    background.appendChild(speed);
    let topIncrement: number = 0;
    const interval = setInterval(() => {
      topIncrement += 100;
      speed.style.top = topIncrement + "px";
      if (topIncrement > heightTotal) {
        background.removeChild(speed);
        clearInterval(interval);
      }
    }, 25);
  }

  private sendMoveRequest() {
    this.socket.sendMoveRequest();
  }
}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Guideline2Page} from "../guideline2/guideline2";

/**
 * Generated class for the MoveguidelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-moveguideline',
  templateUrl: 'moveguideline.html',
})
export class MoveguidelinePage {

  private isRolling: boolean = false;
  private finish: boolean = false;
  private intervals: number[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    const slider = document.getElementById("slider");
    const slider2 = document.getElementById("slider2");
    const slide = document.getElementById("slide");
    const slide2 = document.getElementById("slide2");
    const background = document.getElementById("background");
    const width: number = slider.clientWidth;
    const startY: number = slider.offsetTop;
    const goalY: number = slider.clientHeight + startY - width;
    this.animateArrow("");
    this.animateArrow("-");
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

  onSlideMove(e, width, slide, goalY, background, slider, slider2, slide2, startY, original: boolean) {
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
      if (!original && !this.finish) {
        this.finish = true;
        this.intervals.forEach(interval => clearInterval(interval));
        this.navCtrl.push(Guideline2Page);
      }
    }
  }

  private animateArrow(idIndicator: string): void {
    let i = 0;
    let arrow: HTMLImageElement;
    this.intervals.push(setInterval(() => {
      arrow = <HTMLImageElement>document.getElementById("arrow" + idIndicator + i);
      arrow.src = "../assets/imgs/fleche-red.svg";
      if (i > 0) {
        const previousArrow = <HTMLImageElement>document.getElementById("arrow" + idIndicator + (i - 1));
        previousArrow.src = "../assets/imgs/fleche.svg"
      } else {
        const previousArrow = <HTMLImageElement>document.getElementById("arrow" + idIndicator + 3);
        previousArrow.src = "../assets/imgs/fleche.svg"
      }
      i = (i + 1) % 4;
    }, 200));
  }

  private moveSand() {
    const sable: HTMLImageElement = <HTMLImageElement>document.getElementById("sable");
    const sable2: HTMLImageElement = <HTMLImageElement>document.getElementById("sable2");
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
}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
    this.addArrow(startY, goalY, slider.offsetLeft);
    slide.style.width = width + "px";
    slide.style.height = width + "px";
    slide.ontouchmove = (e) => this.onSlideMove(e, width, slide, goalY, background, slider, slider2, slide2, startY, true);
    slide2.ontouchmove = (e) => this.onSlideMove(e, width, slide2, goalY, background, slider2, slider, slide, startY, false);
  }

  onSlideMove(e, width, slide, goalY, background, slider, slider2, slide2, startY, original: boolean) {
    const y = e.touches[0].clientY;
    const trueY = y - width / 2;
    if (trueY > startY) {
      slide.style.top = trueY + "px";
    }
    if (trueY > goalY) {
      if (original) {
        background.classList.remove("nine-row");
        background.classList.add("nine-row-2");
      } else {
        background.classList.remove("nine-row-2");
        background.classList.add("nine-row");
      }
      slider.classList.remove("visible");
      slider.classList.add("invisible");
      slider2.classList.remove("invisible");
      slider2.classList.add("visible");
      slide2.style.width = width + "px";
      slide2.style.height = width + "px";
      slide.style.top = startY + "px";
    }
  }

  private addArrow(startY, endY, leftMargin) : void{
    let arrow : HTMLImageElement;
    for (let i = 0; i < 6; i++) {
      arrow = document.createElement("img");
      arrow.id = "arrow";
      arrow.src = "../assets/imgs/fleche.svg";
      arrow.style.position= "absolute";
      arrow.style.top = "0px";
      arrow.style.left = "0px";
      arrow.style.width = "50px";
      arrow.style.height = "50px";
    }
  }
}

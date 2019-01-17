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
    const goalY: number = slider.clientHeight + slider.clientTop - (width / 4);
    const startY: number = width - (width / 4);
    slide.style.width = width + "px";
    slide.style.height = width + "px";

    slide.ontouchmove = (e) => {
      const y = e.touches[0].clientY;
      const trueY = y - width / 2;
      slide.style.top = trueY + "px";
      if (trueY > goalY) {
        background.classList.remove("nine-row");
        background.classList.add("nine-row-2");
        slider.classList.remove("visible");
        slider.classList.add("invisible");
        slider2.classList.remove("invisible");
        slider2.classList.add("visible");
        slide2.style.width = width + "px";
        slide2.style.height = width + "px";
        slide.style.top = startY + "px";
      }
    };

    slide2.ontouchmove = (e) => {
      const y = e.touches[0].clientY;
      const trueY = y - width / 2;
      slide2.style.top = trueY + "px";
      if (trueY > goalY) {
        background.classList.remove("nine-row-2");
        background.classList.add("nine-row");
        slider2.classList.remove("visible");
        slider2.classList.add("invisible");
        const slide = document.getElementById("slide2");
        slider.classList.remove("invisible");
        slider.classList.add("visible");
        slide.style.width = width + "px";
        slide.style.height = width + "px";
        slide2.style.top = startY + "px";

      }
    }
  }
}

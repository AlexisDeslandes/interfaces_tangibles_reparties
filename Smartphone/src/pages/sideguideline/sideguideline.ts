import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the SideguidelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sideguideline',
  templateUrl: 'sideguideline.html',
})
export class SideguidelinePage {

  right: boolean = false;
  red: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    setInterval(() => this.triggerArrow(), 500);
  }

  private triggerArrow() {
    const url: string = this.red ? "../assets/imgs/fleche.svg" : "../assets/imgs/fleche-red.svg";
    const urlPhone: string = this.red ? "../assets/imgs/phone.svg" : "../assets/imgs/phone-slide.svg";
    const justifyContentPhone: string = this.red ? "center" : "start";
    const arrow: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche");
    const arrow2: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche2");
    const phone: HTMLImageElement = <HTMLImageElement>document.getElementById("phone-img");
    const bikeWrapper: HTMLElement = document.getElementById("bike-wrapper");
    bikeWrapper.style.justifyContent = justifyContentPhone;
    phone.src = urlPhone;
    arrow.src = url;
    arrow2.src = url;
    this.red = !this.red;
  }

}

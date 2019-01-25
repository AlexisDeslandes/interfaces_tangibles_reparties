import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SideguidelinePage} from "../sideguideline/sideguideline";
import {MoveguidelinePage} from "../moveguideline/moveguideline";

/**
 * Generated class for the GuidelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guideline',
  templateUrl: 'guideline.html',
})
export class GuidelinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuidelinePage');
  }

  goToMoveguidelinePage() {
    this.navCtrl.push(MoveguidelinePage)
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SideguidelinePage} from "../sideguideline/sideguideline";

/**
 * Generated class for the Guideline2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guideline2',
  templateUrl: 'guideline2.html',
})
export class Guideline2Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Guideline2Page');
  }

  goToSideGuideline() {
    this.navCtrl.push(SideguidelinePage)
  }
}

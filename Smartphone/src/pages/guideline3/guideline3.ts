import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ReadyPage} from "../ready/ready";

/**
 * Generated class for the Guideline3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-guideline3',
  templateUrl: 'guideline3.html',
})
export class Guideline3Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Guideline3Page');
  }

    goToReady() {
        this.navCtrl.push(ReadyPage)
    }
}

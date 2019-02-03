import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";

/**
 * Generated class for the ReadyStepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ready-step',
  templateUrl: 'ready-step.html',
})
export class ReadyStepPage {

  isReady;

  colors = ["", "#a22b28", "#393bb5", "#007207", "#b8b918"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public socketManager: SocketManagerProvider) {
    this.isReady = false;
  }

  ready(){
    //document.getElementById("ready-step-wrapper").style.backgroundColor = this.colors[1];
    this.socketManager.sendReady();
    this.isReady = true;
  }

}

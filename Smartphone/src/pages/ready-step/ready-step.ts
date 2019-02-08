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
  socket;

  colors = ["", "#a22b28", "#393bb5", "#007207", "#b8b918"];

  constructor(public navCtrl: NavController, public navParams: NavParams, public socketManager: SocketManagerProvider) {
    this.isReady = false;
    this.socket = socketManager;
    socketManager.playerColor = this.colors[socketManager.player];
  }

  ionViewDidLoad() {
      document.getElementById("ready-button").style.backgroundColor = this.colors[this.socket.player];
      console.log(this.socket.playerColor);
  }

  ready(){
    this.socketManager.sendReady();
    this.isReady = true;
  }

}

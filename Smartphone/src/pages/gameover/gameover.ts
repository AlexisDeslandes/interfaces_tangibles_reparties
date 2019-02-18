import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";

/**
 * Generated class for the GameoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gameover',
  templateUrl: 'gameover.html',
})
export class GameoverPage {

  jauge;
  playerColor;
  statsNames = {"chicken":"Faim", "water":"Soif", "mood":"Humeur", "bike":"Usure du vélo", "energy":"Energie",
        "Couverture":"Couverture de survie", "Duvet": "Duvet"};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.jauge = this.statsNames[this.navParams.get("jauge")];
    this.playerColor = this.navParams.get("playerColor");
  }


  goHome(){
    this.navCtrl.push(HomePage,{})
  }

}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GamePage} from "../game/game";

/**
 * Generated class for the ReadyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ready',
  templateUrl: 'ready.html',
})
export class ReadyPage {

  players: number = 3;
  seconds: number = 5;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  peopleJoin() {
    if (--this.players === 0) {
      const timeOut: number = setInterval(() => {
        if (--this.seconds === 0) {
          clearTimeout(timeOut);
          this.navCtrl.push(GamePage)
        }
      }, 1000);
    }
  }


}

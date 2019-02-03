import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GamePage} from "../game/game";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs";

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

  players: number = -1;
  seconds: number = 5;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socketManager: SocketManagerProvider) {
    this.players = this.socketManager.player;
    this.socketManager.stateSubject.subscribe(data => {
      if (data["status"] == "playerJoinedVelo" && data['playerId'] != this.socketManager.player) {
        --this.players;
      }
      if (data['status'] === "veloReady") {
        this.players = 0;
        const timeOut: number = setInterval(() => {
          if (--this.seconds === 0) {
            clearTimeout(timeOut);
            this.navCtrl.push(GamePage,{playersCount : this.players});
          }
        }, 1000);
      }
    })
  }

  actionButton() {
    const button = document.getElementById("readyButton");
    button.style.display = "None";
    this.peopleJoin()
  }

  peopleJoin() {
    this.socketManager.playerJoined();
    --this.players;
  }


    startt() {
        this.navCtrl.push(GamePage,{playersCount : this.players});
    }
}

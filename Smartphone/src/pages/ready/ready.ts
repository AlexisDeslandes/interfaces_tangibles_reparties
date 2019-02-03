import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GamePage} from "../game/game";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";

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

    seconds: number = 5;

    constructor(public navCtrl: NavController, public navParams: NavParams, private socketManager: SocketManagerProvider) {
        this.socketManager.stateSubject.subscribe(data => {
            if (data['status'] === "veloReady") {
                const timeOut: number = setInterval(() => {
                    if (--this.seconds === 0) {
                        clearTimeout(timeOut);
                        this.navCtrl.push(GamePage);
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
    }
}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";

/**
 * Generated class for the FinishPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-finish',
    templateUrl: 'finish.html',
})
export class FinishPage {

    playerColor;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.playerColor = this.navParams.get("playerColor");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FinishPage');
    }

    goHome() {
        this.navCtrl.push(HomePage, {})
    }

}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {MoveguidelinePage} from "../moveguideline/moveguideline";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";


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

    public joined: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private socketManager: SocketManagerProvider) {
        this.socketManager.stateSubject.subscribe(data => {
            if (data['status'] === "guideline1") {
                this.navCtrl.push(MoveguidelinePage)
            }
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GuidelinePage');
    }

    goToMoveguidelinePage() {
        this.joined = true;
        this.socketManager.sendGuideline1Ready();
    }
}

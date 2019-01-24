import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs/Rx";

/**
 * Generated class for the DilemmePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-dilemme',
    templateUrl: 'dilemme.html',
})
export class DilemmePage {

    data;
    hasAnswered = false;
    choice = null;
    result;
    socketSubscription: Subscription;
    isReady;

    constructor(public navCtrl: NavController, public navParams: NavParams, public socketManager: SocketManagerProvider) {
        this.data = navParams.get('step');
        this.isReady = false;

        this.socketSubscription = this.socketManager.stateSubject.subscribe(data => {
            if (data['status'] === 'start'){
                console.log('EEEH MACARENA', data)
            }
        })
    }

    answer() {
        this.hasAnswered = true;
        this.result = this.data.choices[this.choice].result;
    }

    ready(){
        this.isReady = true;
        this.socketManager.sendReady();
    }

    next() {
        this.socketManager.sendNext();
    }

}

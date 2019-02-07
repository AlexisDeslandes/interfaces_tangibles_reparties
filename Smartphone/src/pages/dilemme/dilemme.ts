import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs/Rx";
import {ReadyPage} from "../ready/ready";
import {InventoryPage} from "../inventory/inventory";
import {GuidelinePage} from "../guideline/guideline";

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

    @ViewChild(Slides) slides: Slides;


    data;
    hasAnswered = false;
    choice = null;
    result;
    stats;
    isReady;
    slideOptions = {effect: 'flip'};
    showIntro = true;
    showContent = false;
    receivedPart = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public socketManager: SocketManagerProvider) {
        this.data = navParams.get('step');
        if (!this.data.hasOwnProperty('intro')) {
            this.showIntro = false;
            this.showContent = true;
        } else {
            this.showIntro = true;
            this.showContent = false;
        }
        this.isReady = false;

        this.socketManager.socket.on('ask-for-new-part', () => {
            this.receivedPart = true;
            console.log('received image :)')
        });

    }

    nextIntro() {

        this.slides.slideNext();

    }

    endIntro() {
        this.showIntro = false;
        this.showContent = true;
    }

    openInventory() {
        this.navCtrl.push(InventoryPage);
    }


    answer() {

    const statsNames = {"chicken":"Faim", "water":"Soif", "mood":"Humeur", "bike":"Usure du vélo", "energy":"Energie"};

    this.hasAnswered = true;
    this.result = this.data.choices[this.choice].result;
    this.stats = this.data.choices[this.choice].stats;

    this.socketManager.socket.emit('updateStats', {room: this.socketManager.room, stats: this.stats});
    this.socketManager.socket.emit('ask-for-new-part', {room: this.socketManager.room, stats: this.stats});

    for (let stat of this.stats) {
      stat.type = statsNames[stat.type];
    }
  }

    ready() {
        this.isReady = true;
        this.socketManager.sendReady();
    }

    next() {
        this.socketManager.sendNext();
    }

    goTo() {
        //this.navCtrl.push(GuidelinePage);
        this.navCtrl.push(ReadyPage);
    }
}

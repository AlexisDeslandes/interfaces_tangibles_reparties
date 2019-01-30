import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {HomePage} from "../home/home";

/**
 * Generated class for the InventoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inventory',
    templateUrl: 'inventory.html',
})
export class InventoryPage {

    puzzle: any[];
    ownedPieces: any[];
    showPuzzle;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public socketManager: SocketManagerProvider) {

        this.showPuzzle = false;
        this.puzzle = [];
        this.ownedPieces = [];

        this.socketManager.socket.on('get-puzzle', data => {
            this.puzzle = data.puzzle;
            this.showPuzzle = true;
        });

        this.socketManager.socket.on('get-puzzle-part', data => {
            this.ownedPieces.push(data);
        })
    }

    askForImage() {
        this.socketManager.socket.emit('get-puzzle-part');
    }

    getPuzzle() {
        this.socketManager.socket.emit('get-puzzle');
    }

    goHome(){
        this.navCtrl.push(HomePage);
    }


}

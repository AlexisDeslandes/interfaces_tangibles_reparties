import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {HomePage} from "../home/home";
import * as $ from 'jquery'

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
    selectedPiece;
    targetsOn;
    showResult;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public socketManager: SocketManagerProvider) {

        this.showResult = socketManager.puzzleEnded;

        this.showPuzzle = false;
        this.puzzle = [];
        this.ownedPieces = [];
        this.selectedPiece = null;
        this.targetsOn = false;

        this.socketManager.socket.emit('get-player-puzzle-parts',{room : this.socketManager.room});

        this.socketManager.socket.on('get-puzzle-parts', data => {
           console.log('player has '+data.length+' images in inventory');
            this.ownedPieces = data;
        });

        this.socketManager.socket.on('get-puzzle', data => {
            this.puzzle = data.puzzle;
            this.showPuzzle = true;
        });

        /*
        this.socketManager.socket.on('get-puzzle-part', data => {
            this.ownedPieces.push(data);
        });
        */

        this.socketManager.socket.on('puzzle-ended',data => {
            console.log("puzzle ended");
            this.showPuzzle = false;
            this.showResult = true;
            this.socketManager.puzzleEnded = true;
        });
    }

    selectPiece(i) {
        if (this.selectedPiece === i) {
            this.selectedPiece = null;
            this.targetsOn = false;
        } else {
            this.selectedPiece = i;
            this.targetsOn = true;
        }
    }

    pickTarget(o, i) {
        let id = '#piece' + i;
        if (this.selectedPiece) {
            this.socketManager.socket.emit('put-part-of-puzzle', {
                room: this.socketManager.room,
                source : this.selectedPiece,
                target : o
            });
            if (!o.shown) {
                if (o.picture === this.selectedPiece.picture) {
                    this.showSuccess(id);
                    o.shown = true;
                    this.removeFromOwned(o);
                    this.selectedPiece = null;
                    this.targetsOn = false;
                } else {
                    this.showError(id)
                }
            }
        }
    }

    showError(id) {
        $(id).addClass('answer-false');
        setTimeout(() => {
            $(id).removeClass('answer-false');
        }, 1000);
    }

    showSuccess(id) {
        $(id).addClass('answer-true');
        setTimeout(() => {
            $(id).removeClass('answer-true');
        }, 1000);
    }

    removeFromOwned(o) {
        for (let i in this.ownedPieces) {
            let p = this.ownedPieces[i];
            if (p.picture === o.picture) {
                this.ownedPieces.splice(parseInt(i), 1)
            }
        }
    }

    askForImage() {
        this.socketManager.socket.emit('get-puzzle-part', {room: this.socketManager.room});
    }

    getPuzzle() {
        this.socketManager.socket.emit('show-puzzle-on-table', {room: this.socketManager.room});
    }

    goHome() {
        this.navCtrl.push(HomePage);
    }


}

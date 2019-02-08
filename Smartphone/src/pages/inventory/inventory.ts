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
    selectPuzzle;

    currentPuzzleName;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public socketManager: SocketManagerProvider) {


        this.currentPuzzleName = null;
        this.showPuzzle = false;
        this.puzzle = [];
        this.ownedPieces = [];
        this.selectedPiece = null;
        this.targetsOn = false;

        this.socketManager.socket.emit('get-player-puzzle-parts', {room: this.socketManager.room});

        this.socketManager.socket.on('get-puzzle-parts', data => {
            this.ownedPieces = data;
        });

        this.socketManager.socket.on('get-puzzle', data => {
            this.puzzle = data.puzzle.parts;
            this.currentPuzzleName = data.puzzle.name;
            this.showPuzzle = true;
        });

        this.socketManager.socket.on('puzzle-ended', data => {
            console.log("puzzle ended");
            this.currentPuzzleName = data.puzzle;
            this.showPuzzle = false;
            this.showResult = true;
            this.socketManager.puzzleEnded = true;
        });
    }

    selectPiece(i, p) {
        if (this.selectedPiece === i) {
            this.selectedPiece = null;
            this.selectPuzzle = null;
            this.targetsOn = false;
        } else {
            this.selectedPiece = i;
            this.selectPuzzle = p;
            this.targetsOn = true;
        }
    }

    pickTarget(o, i) {

        let id = '#piece' + i;
        if (this.selectedPiece) {
            console.log('selected piece',this.selectedPiece)
            this.socketManager.socket.emit('put-part-of-puzzle', {
                sourcePuzzle: this.selectPuzzle,
                targetPuzzle : this.currentPuzzleName,
                room: this.socketManager.room,
                source: this.selectedPiece,
                puzzle:this.currentPuzzleName,
                target: o
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
            let p = this.ownedPieces[i].piece;
            let z = this.ownedPieces[i].puzzle;
            if (p.picture === o.picture && z === this.currentPuzzleName) {
                this.ownedPieces.splice(parseInt(i), 1)
            }
        }
    }


    getPuzzle2() {
        this.socketManager.socket.emit('show-puzzle-on-table', {
            room: this.socketManager.room,
            puzzle: 'puzzle2'
        });
    }

    getPuzzle1() {
        this.socketManager.socket.emit('show-puzzle-on-table', {
            room: this.socketManager.room,
            puzzle: 'puzzle1'
        });
    }

    goHome() {
        this.navCtrl.push(HomePage);
    }


}

import {Component, OnInit} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {MoveguidelinePage} from "../moveguideline/moveguideline";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs";
import {DilemmePage} from "../dilemme/dilemme";
import {ReadyStepPage} from "../ready-step/ready-step";
import {GameoverPage} from "../gameover/gameover";
import {GuidelinePage} from "../guideline/guideline";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {FinishPage} from "../finish/finish";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {


    status = "";
    socketSubscription: Subscription;
    code;


    constructor(public navCtrl: NavController, public socketManager: SocketManagerProvider,
                public toastController: ToastController, private scanner: BarcodeScanner) {


        this.socketManager.socket.on('death', (m) => {
            console.log("DEAD");
            this.navCtrl.push(GameoverPage, {jauge: m.jauge, playerColor: this.socketManager.playerColor});
        });


        this.status = "Connexion au serveur en cours...";

        this.socketSubscription = this.socketManager.stateSubject.subscribe(data => {
            if (data['status'] === 'connected') {
                this.status = data['message'];
                this.navCtrl.push(ReadyStepPage);
            } else if (data['status'] === 'gameover') {
                this.navCtrl.push(FinishPage, {playerColor: socketManager.playerColor});
            } else if (data['status'] === 'start') {
                this.go();
                switch (data['step'].type) {
                    case 'dilemme':
                        this.navCtrl.push(DilemmePage, data);
                        break;
                    case 'minijeu':
                        if (this.socketManager.player == 1) {
                            this.navCtrl.push(GuidelinePage, data);
                            break;
                        }
                }
            }
        })

    }

    connectWithCode() {
        console.log(this.code);
        if (/([0-9]+-[0-9])/.test(this.code)) {
            let t = this.code.split('-');
            this.socketManager.join('game' + t[0], t[1])
        } else {
            this.code = "";
            this.toastController.create({
                message: 'Mauvais code',
                duration: 2000
            }).present();
        }
    }


    startQR() {
        this.scanner.scan().then(data => {
            this.code = data.text;
            this.connectWithCode()
        })
    }

    go() {

    }

    accessToGuideline() {
        this.navCtrl.push(MoveguidelinePage)
    }


}

import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Gyroscope} from "@ionic-native/gyroscope";
import {Subscription} from "rxjs";
import {Guideline3Page} from "../guideline3/guideline3";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";

/**
 * Generated class for the SideguidelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sideguideline',
    templateUrl: 'sideguideline.html',
})
export class SideguidelinePage {

    right: boolean = false;
    red: boolean = false;
    gyroscopeValueY: any = "";
    private loopInterval: number;
    private loopInterval2: number;
    private gyroscopePointer: Subscription;

    constructor(public navCtrl: NavController, public navParams: NavParams, private socket: SocketManagerProvider) {
        this.socket.activateObstacle();
        this.gyroscopePointer = Gyroscope.watch({frequency: 16}).subscribe(value => {
            this.socket.sendMoveSideRequest(value.y);
            this.gyroscopeValueY = value.y;
            if (this.gyroscopeValueY < -1 && !this.right) {
                clearInterval(this.loopInterval);
                this.loopInterval2 = setInterval(this.triggerArrow2, 500);
                this.setColorWhite(!this.right);
                this.right = true;
            } else if (this.gyroscopeValueY > 1 && this.right) {
                clearInterval(this.loopInterval2);
                this.loopInterval = setInterval(this.triggerArrow, 500);
                this.setColorWhite(!this.right);
                this.right = false;
            }
        });
    }

    ionViewDidLoad() {
        this.loopInterval = setInterval(this.triggerArrow, 500);
    }

    private triggerArrow() {
        const url: string = this.red ? "../assets/imgs/fleche.svg" : "../assets/imgs/fleche-red.svg";
        const urlPhone: string = this.red ? "../assets/imgs/phone.svg" : "../assets/imgs/phone-slide.svg";
        const justifyContentPhone: string = this.red ? "center" : "flex-start";
        const arrow: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche");
        const arrow2: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche2");
        const phone: HTMLImageElement = <HTMLImageElement>document.getElementById("phone-img");
        const bikeWrapper: HTMLElement = document.getElementById("bike-wrapper");
        bikeWrapper.style.justifyContent = justifyContentPhone;
        phone.src = urlPhone;
        arrow.src = url;
        arrow2.src = url;
        this.red = !this.red;
    }

    private triggerArrow2() {
        const url: string = this.red ? "../assets/imgs/fleche.svg" : "../assets/imgs/fleche-red.svg";
        const urlPhone: string = this.red ? "../assets/imgs/phone.svg" : "../assets/imgs/slide2.svg";
        const justifyContentPhone: string = this.red ? "center" : "flex-end";
        const arrow: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche3");
        const arrow2: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche4");
        const phone: HTMLImageElement = <HTMLImageElement>document.getElementById("phone-img");
        const bikeWrapper: HTMLElement = document.getElementById("bike-wrapper");
        bikeWrapper.style.justifyContent = justifyContentPhone;
        phone.src = urlPhone;
        arrow.src = url;
        arrow2.src = url;
        this.red = !this.red;
    }

    private setColorWhite(left: boolean): void {
        const url: string = "../assets/imgs/fleche.svg";
        const id0: string = left ? "" : "3";
        const id1: string = left ? "2" : "4";
        const arrow: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche" + id0);
        const arrow2: HTMLImageElement = <HTMLImageElement>document.getElementById("fleche" + id1);
        arrow.src = url;
        arrow2.src = url;
    }

    nextStep() {
        clearInterval(this.loopInterval);
        clearInterval(this.loopInterval2);
        this.gyroscopePointer.unsubscribe();
        this.socket.leaveGame();
        this.navCtrl.push(Guideline3Page);
    }

}

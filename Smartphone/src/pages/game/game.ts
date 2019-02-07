import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Guideline2Page} from "../guideline2/guideline2";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Gyroscope} from "@ionic-native/gyroscope";
import {ReadyPage} from "../ready/ready";
import {Sand} from "../../class/Sand";
import {Speed} from "../../class/Speed";

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-game',
    templateUrl: 'game.html',
})
export class GamePage {

    private ctxSand: CanvasRenderingContext2D;
    private ctxBike: CanvasRenderingContext2D;
    private ctxSpeed: CanvasRenderingContext2D;

    private sand: HTMLImageElement;
    private sandPosition: Sand;
    private width: number;
    private height: number;

    private positionBikeV1: boolean = true;
    private bike: HTMLImageElement;
    private bike2: HTMLImageElement;

    private speed: Speed;
    private speedImg: HTMLImageElement;

    constructor(public navCtrl: NavController, public navParams: NavParams, private socket: SocketManagerProvider) {
        this.socket.stateSubject.subscribe(data => {
            if (data['status'] === 'dead') {
                const grid = document.getElementById('main');
                grid.style.display = 'none';
                const grid2 = document.getElementById('second');
                grid2.style.display = 'block';
            }
        });
        Gyroscope.watch({frequency: 16}).subscribe(value => {
            this.socket.sendMoveSideRequest(value.y);
        });
    }

    ionViewDidLoad() {

        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;

        const sandCanvas = document.getElementById('sand') as HTMLCanvasElement;
        const bikeCanvas = document.getElementById('bike') as HTMLCanvasElement;
        const speedCanvas = document.getElementById('speed') as HTMLCanvasElement;

        sandCanvas.width = bikeCanvas.width = speedCanvas.width = this.width;
        sandCanvas.height = bikeCanvas.height = speedCanvas.height = this.height;

        this.ctxSand = sandCanvas.getContext("2d");
        this.ctxBike = bikeCanvas.getContext("2d");
        this.ctxSpeed = speedCanvas.getContext("2d");

        this.sand = document.getElementById('sable') as HTMLImageElement;
        this.bike = document.getElementById('bikeImg') as HTMLImageElement;
        this.bike2 = document.getElementById('bikeImg2') as HTMLImageElement;

        this.speedImg = document.getElementById('speedImg') as HTMLImageElement;

        const heightRound: number = Math.round(this.height / 10) * 10;

        this.sandPosition = new Sand(heightRound);
        this.speed = new Speed();

        const drawSandAndSpeed = () => {

            this.ctxSpeed.clearRect(0, 0, this.width, this.height);
            this.speed.move(this.height);
            for (let elem of this.speed.speedArray) {
                this.ctxSpeed.drawImage(this.speedImg, elem.x, elem.y, 3, 107);
            }
            this.speed.add(this.width);

            this.ctxSand.clearRect(0, 0, this.width, this.height);
            this.sandPosition.move();
            this.ctxSand.drawImage(this.sand, 0, this.sandPosition.topSable, this.width, heightRound);
            this.ctxSand.drawImage(this.sand, 0, this.sandPosition.topSable2, this.width, heightRound);
            requestAnimationFrame(drawSandAndSpeed);
        };

        const drawBike = () => {
            const fps = 5;
            let now;
            let then = Date.now();
            let interval = 1000 / fps;
            let delta;
            const draw = () => {
                requestAnimationFrame(draw);
                now = Date.now();
                delta = now - then;
                if (delta > interval) {
                    then = now - (delta % interval);
                    this.ctxBike.clearRect(0, 0, this.width, this.height);
                    const img: HTMLImageElement = this.positionBikeV1 ? this.bike : this.bike2;
                    this.ctxBike.drawImage(img, 0, 0, this.width, this.height);
                    this.positionBikeV1 = !this.positionBikeV1;
                }
            };
            draw();
        };

        drawSandAndSpeed();
        drawBike();

        const slider = document.getElementById("slidr");
        const slide = document.getElementById("slid");
        const slide2 = document.getElementById("slid2");
        const width: number = slider.clientWidth;
        const startY: number = slider.offsetTop;
        const goalY: number = slider.clientHeight + startY - width;
        slide.style.width = width + "px";
        slide.style.height = width + "px";
        slide2.style.width = width + "px";
        slide2.style.height = width + "px";
        slide.ontouchmove = (e) => this.onSlideMove(e, width, goalY, startY);

    }

    onSlideMove(e, width, goalY, startY) {
        const touches = e.touches;
        if (touches.length === 2 && touches[0].target.id == "slid" && touches[1].target.id == "slid2") {
            let left = touches[0];
            let right = touches[1];
            const yLeft = left.clientY - width / 2;
            const yRight = right.clientY - width / 2;
            if (yLeft > startY && yLeft < goalY) {
                left.target.style.top = yLeft + "px";
            }
            if (yRight > startY && yRight < goalY) {
                right.target.style.top = yRight + "px";
            }
            this.sendMoveRequest();
        }
    }

    private sendMoveRequest() {
        this.socket.sendMoveRequest();
    }
}

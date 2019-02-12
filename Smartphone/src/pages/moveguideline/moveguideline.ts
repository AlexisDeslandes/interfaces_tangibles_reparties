import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Sand} from "../../class/Sand";
import {Speed} from "../../class/Speed";
import {Guideline2Page} from "../guideline2/guideline2";

/**
 * Generated class for the MoveguidelinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-moveguideline',
    templateUrl: 'moveguideline.html',
})
export class MoveguidelinePage {

    private intervals: number[] = [];
    private width: number;
    private height: number;

    private ctxSand: CanvasRenderingContext2D;
    private ctxBike: CanvasRenderingContext2D;
    private ctxSpeed: CanvasRenderingContext2D;

    private sand: HTMLImageElement;
    private sandPosition: Sand;

    private positionBikeV1: boolean = true;
    private bike: HTMLImageElement;
    private bike2: HTMLImageElement;

    private speed: Speed;
    private speedImg: HTMLImageElement;

    private animationToCancel = [];
    indications: string = 'Maintenez appuyez la pédale de gauche et droite tout en alternant de haut en bas pour avancer.';

    constructor(public navCtrl: NavController, public navParams: NavParams, private socket: SocketManagerProvider) {

    }

    ionViewDidLoad() {
        this.animateArrow();
        this.animateArrow2();

        this.width = document.body.clientWidth;
        this.height = document.body.clientHeight;

        const sandCanvas = document.getElementById('sand2') as HTMLCanvasElement;
        const bikeCanvas = document.getElementById('bike2') as HTMLCanvasElement;
        const speedCanvas = document.getElementById('speed2') as HTMLCanvasElement;

        sandCanvas.width = bikeCanvas.width = speedCanvas.width = this.width;
        sandCanvas.height = bikeCanvas.height = speedCanvas.height = this.height;

        this.ctxSand = sandCanvas.getContext("2d");
        this.ctxBike = bikeCanvas.getContext("2d");
        this.ctxSpeed = speedCanvas.getContext("2d");

        this.sand = document.getElementById('sable2') as HTMLImageElement;
        this.bike = document.getElementById('bikeImag') as HTMLImageElement;
        this.bike2 = document.getElementById('bikeImag2') as HTMLImageElement;

        this.speedImg = document.getElementById('speedImg2') as HTMLImageElement;

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

        this.animationToCancel.push(requestAnimationFrame(drawSandAndSpeed));
        this.animationToCancel.push(requestAnimationFrame(drawBike));

        const slider = document.getElementById("sliderr");
        const slide = document.getElementById("slidd");
        const slide2 = document.getElementById("slidd2");
        const width: number = slider.clientWidth;
        const startY: number = slider.offsetTop;
        const goalY: number = slider.clientHeight + startY - width;
        slide.style.width = width + "px";
        slide.style.height = width + "px";
        slide2.style.width = width + "px";
        slide2.style.height = width + "px";
        slide2.style.top = goalY + "px";
        slide.ontouchmove = (e) => this.onSlideMove(e, width, goalY, startY, "slidd", "slidd2");
        slide2.ontouchmove = (e) => this.onSlideMove(e, width, goalY, startY, "slidd2", "slidd");
    }

    private sendMoveRequest() {
        this.socket.sendMoveRequest();
    }

    onSlideMove(e, width, goalY, startY, id, id2) {
        const touches = e.touches;
        if (touches.length === 2 && touches[0].target.id == id && touches[1].target.id == id2) {
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

    private animateArrow(): void {
        const idIndicator = "";
        let i = 0;
        let arrow: HTMLImageElement;
        this.intervals.push(setInterval(() => {
            arrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + i);
            arrow.src = "../assets/imgs/fleche-red.svg";
            if (i > 0) {
                const previousArrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + (i - 1));
                previousArrow.src = "../assets/imgs/fleche.svg"
            } else {
                const previousArrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + 3);
                previousArrow.src = "../assets/imgs/fleche.svg"
            }
            i = (i + 1) % 4;
        }, 200));
    }

    private animateArrow2(): void {
        const idIndicator = "-";
        let i = 3;
        let arrow: HTMLImageElement;
        this.intervals.push(setInterval(() => {
            arrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + i);
            arrow.style.transform = "rotate(180deg)";
            arrow.src = "../assets/imgs/fleche-red.svg";
            if (i < 3) {
                const previousArrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + (i + 1));
                previousArrow.src = "../assets/imgs/fleche.svg"
            } else {
                const previousArrow = <HTMLImageElement>document.getElementById("arrows" + idIndicator + 0);
                previousArrow.src = "../assets/imgs/fleche.svg"
            }
            if (i === 0) {
                i = 3;
            } else {
                i--;
            }
        }, 200));
    }

    nextStep() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.animationToCancel.forEach(animation => cancelAnimationFrame(animation));
        this.navCtrl.push(Guideline2Page);
    }
}

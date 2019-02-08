export class Sand {

    public topSable: number;
    public topSable2: number;
    private height: number;

    constructor(height: number) {
        this.topSable = 0;
        this.topSable2 = height;
        this.height = height;
    }

    move() {
        this.topSable -= 10;
        this.topSable2 -= 10;
        if (this.topSable <= -this.height) {
            this.topSable = this.height;
        }
        if (this.topSable2 <= -this.height) {
            this.topSable2 = this.height;
        }
    }
}
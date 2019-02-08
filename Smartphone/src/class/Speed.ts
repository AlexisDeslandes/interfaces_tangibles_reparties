export class Speed {

    public speedArray: { x: number, y: number }[];

    constructor() {
        this.speedArray = [];
    }

    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    add(width: number) {
        const elem = {x: this.getRandomInt(width), y: -100};
        this.speedArray.push(elem);
    }


    move(height) {
        const newSpeedArray = [];
        for (let elem of this.speedArray){
            elem.y += 100;
            if (elem.y < height){
                newSpeedArray.push(elem);
            }
        }
        this.speedArray = newSpeedArray;
    }
}
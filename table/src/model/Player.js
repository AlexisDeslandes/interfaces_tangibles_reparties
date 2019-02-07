export class Player {

    constructor(id) {
        this.id = id;
        this.attributeCoordinates(id);
    }

    attributeCoordinates(id) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        switch (id) {
            case 1:
                this.x = (width / 2) - 25;
                this.y = Math.round(0.75 * height - 100);
                break;
            case 2:
                this.x = (width / 2) - 25;
                this.y = Math.round(0.25 * height + 100);
                break;
            case 3:
                this.x = Math.round(0.25 * height + 100);
                this.y = (height / 2) - 25;
                break;
            default:
                this.x = Math.round(0.75 * height - 100);
                this.y = (height / 2) - 25;
                break;
        }
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}
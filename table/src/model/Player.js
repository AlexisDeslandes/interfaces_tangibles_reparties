export class Player {

    constructor(id) {
        this.id = id;
        this.attributeCoordinates(id);
    }

    attributeCoordinates(id) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const ecart = height / 4;
        switch (id) {
            case 1:
                this.x = (width / 2) - 25;
                this.y = height - ecart - 100;
                break;
            case 2:
                this.x = (width / 2) - 25;
                this.y = ecart;
                break;
            case 3:
                this.x = ecart;
                this.y = (height / 2) - 25;
                break;
            default:
                this.x = width - ecart - 100;
                this.y = (height / 2) - 25;
                break;
        }
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }
}
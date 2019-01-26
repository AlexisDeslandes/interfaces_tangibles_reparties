export class Player {

    constructor(id) {
        this.id = id;
        this.attributeCoordinates(id);
        this.observers = []
    }

    attributeCoordinates(id) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        switch (id) {
            case 1:
                this.x = (width / 2) - 25;
                this.y = height - 50;
                break;
            case 2:

                break;
            case 3:

                break;
            default:

                break;
        }
    }

    addObserver(observer) {
        this.observers.push(observer);
        this.notifyObservers()
    }

    setCoordinates(x, y) {
        this.x = x;
        this.y = y;
        this.notifyObservers()
    }

    notifyObservers() {
        for (let observer of this.observers) {
            observer.update(this);
        }
    }
}
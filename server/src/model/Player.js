module.exports = class Player {
    constructor(id) {
        this.id = id;
        this.x = -1;
        this.y = -1;
        this.left = -1;
        this.leftMax = -1;
        this.top = -1;
        this.topMax = -1;
    }

    move() {
        if (this.y - 50 >= this.top) {
            this.y -= 50;
        }
    }

    back() {
        if (this.y + 1.15 <= this.topMax) {
            this.y += 1.15;
        }
    }

    moveSide(x) {
        if (this.left < this.x + x && this.leftMax > this.x + x) {
            this.x += x;
        }
    }
};
const Obstacle = require('./Obstacle');
module.exports = class Player {
    constructor(id) {
        this.id = id;
        this.x = -1;
        this.y = -1;
        this.left = -1;
        this.leftMax = -1;
        this.top = -1;
        this.topMax = -1;
        this.obstacles = [new Obstacle(0, 0)];
        this.obstacles = [];
        this.speed = [];
        this.size = 50;
    }

    move() {
        if (this.y - this.size >= this.top) {
            this.y -= this.size;
        }
    }

    moveSide(x) {
        if (this.left < this.x + x && this.leftMax > this.x + x) {
            this.x += x;
        }
    }

    generateObstacle() {
        const random = this.generateRandom();
        this.obstacles.push(new Obstacle(random.x, random.y));
    }

    generateRandom() {
        let x;
        let y;
        switch (this.id) {
            case 1:
                x = Math.floor(Math.random() * (this.leftMax - this.left)) + this.left;
                y = this.top;
                break;
            case 2:
                x = Math.floor(Math.random() * (this.leftMax - this.left)) + this.left;
                y = this.topMax - this.size;
                break;
            case 3:
                x = this.leftMax - this.size;
                y = Math.floor(Math.random() * (this.topMax - this.top)) + this.top;
                break;
            case 4:
                x = this.left;
                y = Math.floor(Math.random() * (this.topMax - this.top)) + this.top;
                break;
            default:
                console.log('Erreur generate obstacle');
                break;
        }
        return {x: x, y: y};
    }

    generateSpeed() {
        const random = this.generateRandom();
        this.speed.push(random);
    }
};
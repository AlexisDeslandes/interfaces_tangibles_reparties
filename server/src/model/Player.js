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
        this.obstacles = [];
        this.obstacles = [];
        this.speed = [];
        this.size = 50;
        this.dead = false;
    }

    empty(){
        this.x = this.y = -100;
        this.obstacles = [];
        this.speed = [];
    }

    isDead() {
        switch (this.id) {
            case 1:
                return this.y >= this.topMax;
            case 2:
                return this.y <= this.top;
            case 3:
                return this.x <= this.left;
            case 4:
                return this.x >= this.leftMax;
            default:
                console.log('error dead');
                return;
        }
    }

    isOutOfMap() {
        switch (this.id) {
            case 1:
                return this.y >= this.topMax + this.size;
            case 2:
                return this.y + this.size <= this.top;
            case 3:
                return this.x + this.size <= this.left;
            case 4:
                return this.x >= this.leftMax + this.size;
            default:
                console.log('error dead');
                return;
        }
    }

    isCollision() {
        return this.obstacles.some(obstacle =>
            this.x < obstacle.x + obstacle.size &&
            this.x + obstacle.size > obstacle.x &&
            this.y < obstacle.y + obstacle.size &&
            this.size + this.y > obstacle.y
        );
    }

    move() {
        switch (this.id) {
            case 1:
                if (this.y - 1.2 >= this.top && !this.isCollision()) {
                    this.y -= 1.2;
                }
                break;
            case 2:
                if (this.y + 1.2 <= this.topMax && !this.isCollision()) {
                    this.y += 1.2;
                }
                break;
            case 3:
                if (this.x + 1.2 <= this.leftMax && !this.isCollision()) {
                    this.x += 1.2;
                }
                break;
            default:
                if (this.x - 1.2 >= this.left && !this.isCollision()) {
                    this.x -= 1.2;
                }
                break;
        }
    }

    moveSide(x) {
        switch (this.id) {
            case 1:
                if (this.left < this.x + x && this.leftMax > this.x + x) {
                    this.x += x;
                }
                break;
            case 2:
                if (this.left < this.x - x && this.leftMax > this.x - x) {
                    this.x -= x;
                }
                break;
            case 3:
                if (this.top < this.y + x && this.topMax > this.y + x) {
                    this.y += x;
                }
                break;
            default:
                if (this.top < this.y - x && this.topMax > this.y - x) {
                    this.y -= x;
                }
                break;
        }
    }

    generateObstacle() {
        if (!this.dead) {
            const random = this.generateRandom();
            this.obstacles.push(new Obstacle(random.x, random.y));
        }
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
                y = this.topMax;
                break;
            case 3:
                x = this.leftMax;
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
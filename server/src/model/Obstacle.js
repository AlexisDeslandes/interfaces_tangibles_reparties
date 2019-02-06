module.exports = class Obstacle {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    intersect(player){
        return false;
    }
}
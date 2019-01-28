module.exports = class Player {
    constructor(id){
        this.id = id;
        this.x = -1;
        this.y = -1;
        this.left = -1;
        this.leftMax = -1;
        this.top = -1;
        this.topMax = -1;
    }

    move(){
        this.y -= 50;
    }

    moveSide(y){
        this.y += y;
    }
};
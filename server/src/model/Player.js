module.exports = class Player {
    constructor(id){
        this.id = id;
        this.x = 1;
        this.y = 4;
        this.obstacles = []
    }

    move(){
        this.y++;
    }
};
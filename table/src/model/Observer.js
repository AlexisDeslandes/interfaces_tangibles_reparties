export class Observer{

    constructor(img) {
        this.img = img;
    }

    update(player){
        this.img.style.left = player.x + "px";
        this.img.style.top = player.y + "px";
    }

}
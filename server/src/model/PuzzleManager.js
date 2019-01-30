module.exports = class PuzzleManager {


    constructor() {
        this.finished = false;
        this.parts = [
            {
                picture: 'row-1-col-1.jpg',
                player: null,
                shown : false,
                x: 1,
                y: 1
            }, {
                picture:
                    'row-1-col-2.jpg',
                player: null,
                shown : false,
                x: 2,
                y: 1
            }, {
                picture:
                    'row-1-col-3.jpg',
                player: null,
                shown : false,
                x: 3,
                y: 1
            },  {
                picture:
                    'row-2-col-1.jpg',
                player: null,
                shown : false,
                x: 1,
                y: 2
            },
            {
                picture: 'row-2-col-2.jpg',
                player: null,
                shown : false,
                x: 2,
                y: 2
            },
            {
                picture: 'row-2-col-3.jpg',
                player: null,
                shown : false,
                x: 3,
                y: 2
            },
            {
                picture: 'row-3-col-1.jpg',
                player: null,
                shown : false,
                x: 1,
                y: 3
            },
            {
                picture: 'row-3-col-2.jpg',
                player: null,
                shown : false,
                x: 2,
                y: 3
            },
            {
                picture: 'row-3-col-3.jpg',
                player: null,
                shown : false,
                x: 3,
                y: 3
            },
            {
                picture: 'row-4-col-1.jpg',
                player: null,
                shown : false,
                x: 1,
                y: 4
            },
            {
                picture: 'row-4-col-2.jpg',
                player: null,
                shown : false,
                x: 2,
                y: 4
            },
            {
                picture: 'row-4-col-3.jpg',
                player: null,
                shown : false,
                x: 3,
                y: 4
            }
        ];
        this.init();
    }

    init(){
        for(let i = 0; i < 3;i++){
            this.parts[this.getRandomInt(0,this.parts.length-1)].shown = true;
        }
    }

    getRandomInt(min,max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    sendPuzzle(socket){
        socket.emit('get-puzzle',{puzzle:this.parts})
    }

    getUnrevealedPart(socket){
        if(!this.finished) {
            let p = this.parts[this.getRandomInt(0, this.parts.length - 1)];
            while (p.shown || p.player !== null) {
                p = this.parts[this.getRandomInt(0, this.parts.length - 1)];
            }
            p.player = socket.id;
            socket.emit('get-puzzle-part',p)
        }
    }

};
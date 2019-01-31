module.exports = class PuzzleManager {

    /**
     * @param n the amount of shown pieces
     */
    constructor(n) {
        this.finished = false;
        this.parts = [
            {
                picture: 'row-1-col-1.jpg',
                player: null,
                shown: false
            }, {
                picture:
                    'row-1-col-2.jpg',
                player: null,
                shown: false
            }, {
                picture:
                    'row-1-col-3.jpg',
                player: null,
                shown: false
            }, {
                picture:
                    'row-2-col-1.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-2-col-2.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-2-col-3.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-3-col-1.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-3-col-2.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-3-col-3.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-4-col-1.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-4-col-2.jpg',
                player: null,
                shown: false
            },
            {
                picture: 'row-4-col-3.jpg',
                player: null,
                shown: false
            }
        ];
        this.init(n);
    }

    init(n) {
        for (let i = 0; i < n; i++) {
            this.parts[this.getRandomInt(0, this.parts.length - 1)].shown = true;
        }
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    isComplete() {
        for (let i in this.parts) {
            if (!this.parts[i].shown) return false;
        }
        this.finished = true;
        return true;
    }

    sendPuzzleParts(socket) {
        let p = [];
        this.parts.forEach(a => {
            if (a.player === socket.id && !a.shown) p.push(a)
        });
        socket.emit('get-puzzle-parts', p)
    }

    playerPuzzleUpdate(socket, d) {
        let res = "fail";
        let source = d.source;
        let target = d.target;
        if (source.picture === target.picture) {

            this.parts.forEach(a => {
                if (a.picture === source.picture) {
                    a.player = socket.id;
                    a.shown = true;
                }
            });

            if (this.isComplete()) {
                res = 'end';
                console.log('puzzle is complete ')
            } else {
                res = 'ok';
                console.log('puzzle updated with a new piece ');
            }

        } else {
            console.log('wrong piece tried on the puzzle')
            //emit fail event to table
        }
        return res;
    }


    sendPuzzle(socket) {
        if (this.finished) {
            socket.emit('puzzle-ended')
        } else {
            socket.emit('get-puzzle', {puzzle: this.parts})
        }
    }


    /**
     * gives a part of the puzzle to a player and send it to him
     */
    getUnrevealedPart(socket) {
        if (!this.finished) {
            let p = this.parts[this.getRandomInt(0, this.parts.length - 1)];
            while (p.shown || p.player !== null) {
                p = this.parts[this.getRandomInt(0, this.parts.length - 1)];
            }
            p.player = socket.id;
            console.log('sending ',socket.id, ' his new puzzle part');
            socket.emit('ask-for-new-part' )
            //this.sendPuzzleParts(socket)
        }
    }

};
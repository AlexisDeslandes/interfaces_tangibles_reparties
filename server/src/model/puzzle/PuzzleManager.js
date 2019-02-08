const puzzle1 = require("./puzzle1");
const puzzle2 = require("./puzzle2");

module.exports = class PuzzleManager {

    /**
     * @param n the amount of shown pieces
     */


    constructor(n) {
        this.finished = false;
        this.parts = puzzle1;


        this.puzzles = [
            {
                name: 'puzzle1',
                parts: puzzle1,
                finished: false
            },
            {
                name: 'puzzle2',
                parts: puzzle2,
                finished: false
            }
        ]
        this.init(n);
    }

    init(n) {
        this.puzzles.forEach(p => {
            for (let i = 0; i < n; i++) {
                p.parts[this.getRandomInt(0, this.parts.length - 1)].shown = true;
            }
        })

    }


    getPuzzleByName(n) {
        for (let p of this.puzzles) {
            if (p.name === n) return p;
        }
        return null;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    sendPuzzleParts(socket) {
        let pers = [];
        this.puzzles.forEach(p => {
            p.parts.forEach(a => {
                if (a.player === socket.id && !a.shown) pers.push({
                    piece: a,
                    puzzle: p.name
                })
            });
        });

        socket.emit('get-puzzle-parts', pers)
    }

    playerPuzzleUpdate(socket, d) {
        let res = "fail";
        let sourcePuzzle = d.sourcePuzzle;
        let targetPuzzle = d.targetPuzzle;
        let source = d.source;
        let target = d.target;
        if (source.picture === target.picture && sourcePuzzle === targetPuzzle) {

            //get puzzle by name
            let puzzle = this.getPuzzleByName(sourcePuzzle);
            puzzle.parts.forEach(a => {
                if (a.picture === source.picture) {
                    a.player = socket.id;
                    a.shown = true;
                }
            });

            if (this.isComplete(sourcePuzzle)) {
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


    sendPuzzle(socket, m) {

        let pz = this.getPuzzleByName(m.puzzle);
        if (pz) {
            if (pz.finished) {
                socket.emit('puzzle-ended')
            } else {
                socket.emit('get-puzzle', {puzzle: pz})
            }
        } else console.log("unknown puzzle", m.puzzle)


    }


    /**
     * gives a part of the puzzle to a player and send it to him
     */
    getUnrevealedPart(socket) {
        let img_count = 0;
        this.puzzles.forEach(pz => {
            if (!pz.finished) {

                let b = Math.random() > 0.3;
                if (b) {
                    img_count++;

                    let p = pz.parts[this.getRandomInt(0, pz.parts.length - 1)];

                    let counter = 0;
                    while ((p.shown || p.player !== null) && counter < pz.parts.length*10) {
                        p = pz.parts[this.getRandomInt(0, pz.parts.length - 1)];
                        counter++
                    }

                    if (!p.shown && !p.player) {
                        p.player = socket.id;
                        console.log('new ' + pz.name + ' part for ', socket.id);
                    }

                }
            }
        });
        socket.emit('ask-for-new-part', {count: img_count})

    }


    isComplete(name) {

        let pz = this.getPuzzleByName(name);
        if (pz) {
            for (let i in pz.parts) {
                if (!pz.parts[i].shown) return false;
            }
            pz.finished = true;
            return true;
        }
        return false;


    }


};
module.exports = class Game {

    constructor(room, nbPlayers, tableSocket) {
        this.players = [];
        this.gameState = "init";
        this.nbPlayers = nbPlayers;
        this.room = room;
        this.tableSocket = tableSocket;
        this.currentStep = 0;

        this.adventureSteps = [
            {
                type : "dilemne",
                desc : "Une dilemne se propose maintenant..."
            },
            {
                type : "minijeu",
                desc : "Et hop c'est l'heure de faire un mini-jeu"
            },
            {
                type : "dilemne",
                desc : "Une nouveau dilemne apparait..."
            },
        ];
        console.log("new game created : " + room)
    }

    addPlayer(socket) {
        if(this.gameState === "init" && !this.alreadyInGame(socket.id)) {

            let name = "player "+(this.players.length+1);
            this.players.push({
                socket: socket,
                name: name
            });
            console.log(name + " joined " + this.room);
            socket.emit("joined", {message : "congratulation, you joined", player : name});

            if(this.players.length === this.nbPlayers){
                console.log("everyone is here, we starting party");
                this.start();
            }
        }
    }

    nextStep(){
        if(this.currentStep  >= this.adventureSteps.length){
            console.log(this.room + " is over");
            this.tableSocket.emit("gameover",{});
            this.sendToAllPlayers("gameover",{});

        } else {
            this.currentStep++;
            this.tableSocket.emit("start",this.adventureSteps[this.currentStep]);
            this.sendToAllPlayers("start",this.adventureSteps[this.currentStep]);
        }
    }


    start(){
        this.gameState = "start";
        this.tableSocket.emit("start",this.adventureSteps[this.currentStep]);
        this.sendToAllPlayers("start",this.adventureSteps[this.currentStep]);
    }


    sendToAllPlayers(topic,param){
        this.players.forEach(p => {
            p.socket.emit(topic,param)
        })
    }


    alreadyInGame(id){
        let found = false;
        this.players.forEach(p => {
            if(p.socket.id === id) {
                found = true;
            }
        });
        return found;
    }

};
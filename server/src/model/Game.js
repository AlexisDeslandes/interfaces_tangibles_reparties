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
                type : "dilemme",
                text : "Il est 19h et tu commences à avoir un petit creux...",
                choices : [
                    {
                        text : "Sucer des cailloux",
                        result : "Très bon choix"
                    },
                    {
                        text : "Manger mon compagnon",
                        result : "Régale toi fraté"
                    },
                    {
                        text : "Objectif Summer Body",
                        result : "Tu le sais ;)"
                    },
                ]
            },
            {
                type : "minijeu",
                desc : "Et hop c'est l'heure de faire un mini-jeu",
                result : "Bravo ct bien"
            },
            {
                type : "dilemme",
                text : "Une dilemme se propose maintenant...",
                choices : [
                    {
                        text : "Faire le choix 1 :o",
                        result : "Très bon choix"
                    },
                    {
                        text : "Faire le choix 2 ;)",
                        result : "Bon choix"
                    },
                    {
                        text : "Faire le choix 3 :>",
                        result : "Choix bien mais pas top"
                    },
                ]
            },
        ];

        console.log("new game created : " + room)
    }

    addAnswer(socket, data){
        //players who has ended ++
        //traitement du résultat
        //réponse au phone
    }

    addPlayer(socket) {
        if(this.gameState === "init" && !this.alreadyInGame(socket.id)) {

            let name = "player "+(this.players.length+1);
            this.players.push({
                socket: socket,
                name: name
            });
            console.log(name + " joined " + this.room);
            socket.emit("joined", {message : "You are connected to the server !", player : name, status:'connected'});

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
            this.tableSocket.emit("start",{status: 'start',step : this.adventureSteps[this.currentStep]});
            this.sendToAllPlayers("start",{status: 'start',step :this.adventureSteps[this.currentStep]});
        }
    }


    start(){
        this.gameState = "start";
        this.tableSocket.emit("start",{status: 'start',step : this.adventureSteps[this.currentStep]});
        this.sendToAllPlayers("start",{status: 'start',step :this.adventureSteps[this.currentStep]});
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
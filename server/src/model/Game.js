module.exports = class Game {


    constructor(room, tableId, tableSocket) {
        this.players = [];
        this.gameStep = "init";
        this.room = room;
        this.tableSocket = tableId;
        console.log("new game created : " + room)
    }

    addPlayer(socket, name) {
        if(this.gameStep === "init" && !this.alreadyInGame(name)) {

            this.players.push({
                socket: socket,
                name: name
            });
            console.log(name + " joined " + this.room);
            socket.emit("joined", {message : "congratulation, you joined", player : name});

            if(this.players.length === 4){
                console.log("everyone is here, we starting boys");
                this.start();
            }
        }
    }

    start(){
        this.gameStep = "start";
        this.tableSocket.emit("start",{});
        this.sendToAllPlayers("start",{})
    }


    sendToAllPlayers(topic,param){
        this.players.forEach(p => {
            p.socket.emit(topic,param)
        })
    }


    alreadyInGame(name){
        let found = false;
        this.players.forEach(p => {
            if(p.name === name) {
                found = true;
            }
        });
        return found;
    }

};
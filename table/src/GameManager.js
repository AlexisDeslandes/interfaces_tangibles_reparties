import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';

class GameManager {

    constructor(widget) {

        this.socket = io.connect('http://localhost:4444');

        this.widget = widget;
        this.widget.hide();

        let self = this;

        this.connectDiv = $("#connect");
        this.startDiv = $("#start-btn");
        this.mapBtn = $("#fab");
        this.readyBtn = $("#ready-btn");
        this.nextBtn = $("#next-btn");

        this.startDiv.click(function () {
            self.start();
        });

        this.mapBtn.click(function () {
            self.showAndHideMap();
        });

        this.readyBtn.click(function () {
            self.ready();
        });

        this.nextBtn.click(function () {
            self.next();
        });

        this.socket.on('start', data => {
            console.log('NEW STEP STARTING');
            console.log(data);
        });

        this.gameRoom = null;

    }


    ready(){
        this.socket.emit('table-ready',{room:this.gameRoom})
    }

    next(){
        this.socket.emit('next',{room:this.gameRoom})
    }

    start() {
        this.socket.emit('init',{});
        this.socket.on('init', data => {
            this.gameRoom = data.room;

            let index = this.gameRoom.indexOf("room");
            var roomId = this.gameRoom.substr(index + 1);

            for(let i = 1; i < 5; i++){
                $('#code-list').append("<li><a href='http://localhost:8100?room="+this.gameRoom+"&player="+i+"'</a>"+ this.gameRoom.substring(4)+"-"+i+"</li>")
            }


            this.startDiv.remove();
            this.connectDiv.show();
        });

    }

    showAndHideMap() {
        //this.widget._domElem.toggle();
        $("#fab").hide();
        $("#start-btn").hide();
        $("#header").hide();
        $("#main-container-board").css("display","block");
    }


}


export default GameManager;
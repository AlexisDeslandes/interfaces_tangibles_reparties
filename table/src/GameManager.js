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

        this.startDiv.click(function () {
            self.start();
        });

        this.mapBtn.click(function () {
            self.showAndHideMap();
        });

        this.gameRoom = null;

    }

    start() {
        this.socket.emit('init',{});
        this.socket.on('init', data => {
            this.gameRoom = data.room;
            for(let i = 1; i < 5; i++){
                $('#code-list').append("<li><a href='http://localhost:8100?room="+this.gameRoom+"&player="+i+"'</a>Joueur "+i+"</li>")
            }

            $('#tip').append("Pour rejoindre sinon : IP:8100/?room="+this.gameRoom+"&player=1");


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
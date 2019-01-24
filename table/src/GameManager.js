import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';

class GameManager {

    constructor() {

        this.socket = io.connect('http://localhost:4444');

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
        $("#fab").hide();
        $("#start-btn").hide();
        $("#header").hide();
        $("#main-container-board").css("display","block");
        const mapWidget = new MapWidget(document.getElementById('app').offsetLeft,
            document.getElementById('app').parentElement.parentElement.offsetTop,
            document.getElementById('app').offsetWidth,
            document.getElementById('app').offsetHeight);

        $('#app').append(mapWidget.domElem);

        const rationWidgetP3 = new RationWidget('ration-p3', 'p3',
            document.getElementById('ration-container-p3').offsetLeft,
            document.getElementById('ration-container-p3').offsetTop,
            document.getElementById('ration-container-p3').offsetWidth,
            document.getElementById('ration-container-p3').offsetHeight);

        $('#ration-container-p3').append(rationWidgetP3.domElem);
    }


}


export default GameManager;
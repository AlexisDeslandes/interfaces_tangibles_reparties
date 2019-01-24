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
        this.readyBtn = $("#ready-btn");
        this.nextBtn = $("#next-btn");

        this.startDiv.click(function () {
            self.start();
        });

        this.readyBtn.click(function () {
            self.ready();
        });

        this.nextBtn.click(function () {
            self.next();
        });

        this.socket.on('start', data => {
            self.showAndHideMap();
            console.log('NEW STEP STARTING');
            console.log(data);
            self.updateJauges(data.jauges);
        });

        this.gameRoom = null;

    }

    updateJauges(jauges) {
        for (let playerId in jauges) {
            for (let jaugeName in jauges[playerId]) {
                document.getElementById(jaugeName+"-level-p"+playerId).style.height = (jauges[playerId][jaugeName]*10)+"%";
            }
        }
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
        $("#start-btn").hide();
        $("#header").hide();
        $("#connect").hide();
        $("#main-container-board").css("display","block");
        const mapWidget = new MapWidget(document.getElementById('app').offsetLeft,
            document.getElementById('app').parentElement.parentElement.offsetTop,
            document.getElementById('app').offsetWidth,
            document.getElementById('app').offsetHeight);
        $('#app').append(mapWidget.domElem);

        const rationWidgetP1 = new RationWidget('ration-p1', '1', this.gameRoom,
            document.getElementById('ration-container-p1').offsetLeft,
            document.getElementById('ration-container-p1').offsetTop,
            document.getElementById('ration-container-p1').offsetWidth,
            document.getElementById('ration-container-p1').offsetHeight);
        $('#ration-container-p1').append(rationWidgetP1.domElem);

        const rationWidgetP2 = new RationWidget('ration-p2', '2', this.gameRoom,
            document.getElementById('ration-container-p2').offsetLeft,
            document.getElementById('ration-container-p2').offsetTop,
            document.getElementById('ration-container-p2').offsetWidth,
            document.getElementById('ration-container-p2').offsetHeight);
        $('#ration-container-p2').append(rationWidgetP2.domElem);

        const rationWidgetP3 = new RationWidget('ration-p3', '3', this.gameRoom,
            document.getElementById('ration-container-p3').offsetLeft,
            document.getElementById('ration-container-p3').offsetTop,
            document.getElementById('ration-container-p3').offsetWidth,
            document.getElementById('ration-container-p3').offsetHeight);
        $('#ration-container-p3').append(rationWidgetP3.domElem);

        const rationWidgetP4 = new RationWidget('ration-p4', '4', this.gameRoom,
            document.getElementById('ration-container-p4').offsetLeft,
            document.getElementById('ration-container-p4').offsetTop,
            document.getElementById('ration-container-p4').offsetWidth,
            document.getElementById('ration-container-p4').offsetHeight);
        $('#ration-container-p4').append(rationWidgetP4.domElem);
    }


}


export default GameManager;
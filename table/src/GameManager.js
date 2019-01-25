import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';

class GameManager {

    constructor() {

        this.socket = io.connect('http://localhost:4444');

        let self = this;
        let init = true;
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
            console.log('NEW STEP STARTING');
            let nbPlayers = Object.keys(data.jauges).length;
            self.adaptTable(nbPlayers);
            self.updateJauges(data.jauges);
            self.showAndHideMap(nbPlayers);

        });

        this.gameRoom = null;

    }

    updateJauges(jauges) {
        console.log(jauges);
        for (let playerId in jauges) {
            for (let jaugeName in jauges[playerId]) {
                document.getElementById(jaugeName+"-level-p"+playerId).style.height = ((10-jauges[playerId][jaugeName])*10)+"%";
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
            if(this.init){
                this.showAndHideMap();
                this.init = false;
            }
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

    initWidgets(nbPlayer){
        const mapWidget = new MapWidget(document.getElementById('app').offsetLeft,
            document.getElementById('app').parentElement.parentElement.offsetTop,
            document.getElementById('app').offsetWidth,
            document.getElementById('app').offsetHeight);
        $('#app').append(mapWidget.domElem);

        if(nbPlayer >=1 ) {
            const rationWidgetP1 = new RationWidget('ration-p1', '1', this.gameRoom,
                document.getElementById('ration-container-p1').offsetLeft,
                document.getElementById('ration-container-p1').offsetTop,
                document.getElementById('ration-container-p1').offsetWidth,
                document.getElementById('ration-container-p1').offsetHeight);
            $('#ration-container-p1').append(rationWidgetP1.domElem);
        }
        if(nbPlayer >= 2) {
            const rationWidgetP2 = new RationWidget('ration-p2', '2', this.gameRoom,
                document.getElementById('ration-container-p2').offsetLeft,
                document.getElementById('ration-container-p2').offsetTop,
                document.getElementById('ration-container-p2').offsetWidth,
                document.getElementById('ration-container-p2').offsetHeight);
            $('#ration-container-p2').append(rationWidgetP2.domElem);
        }

        if(nbPlayer >= 3) {
            const rationWidgetP3 = new RationWidget('ration-p3', '3', this.gameRoom,
                document.getElementById('ration-container-p3').offsetLeft,
                document.getElementById('ration-container-p3').offsetTop,
                document.getElementById('ration-container-p3').offsetWidth,
                document.getElementById('ration-container-p3').offsetHeight);
            $('#ration-container-p3').append(rationWidgetP3.domElem);
        }

        if(nbPlayer === 4) {
            const rationWidgetP4 = new RationWidget('ration-p4', '4', this.gameRoom,
                document.getElementById('ration-container-p4').offsetLeft,
                document.getElementById('ration-container-p4').offsetTop,
                document.getElementById('ration-container-p4').offsetWidth,
                document.getElementById('ration-container-p4').offsetHeight);
            $('#ration-container-p4').append(rationWidgetP4.domElem);
        }
    }

    showAndHideMap(nbPlayer) {
        $("#start-btn").hide();
        $("#header").hide();
        $("#connect").hide();
        $("#main-container-board").css("display","block");
        this.initWidgets(nbPlayer);


    }

    adaptTable(nbPlayers) {
        switch (nbPlayers) {
            case 1:
                $("#section-2").css("display", "none");
                $("#section-4").css("display", "none");
                $("#section-6").css("display", "none");
                $("#section-6").css("display", "none");
                $(".second-section").css("top", "8%");
                $(".second-section").css("text-align", "center");
                $(".second-section").css("height", "60%");
                $("#section-5").css("width", "60%");
                $("#map").css("position", "relative");
                break;
            case 2:
                console.log($("#section-4"));
                $("#section-4").css("visibility", "hidden");
                $("#section-6").css("visibility", "hidden");

                $("#section-1").css("display", "none");
                $("#section-3").css("display", "none");
                $("#section-2").css("width", "99.5%");

                $("#section-7").css("display", "none");
                $("#section-9").css("display", "none");
                $("#section-8").css("width", "99.5%");
                break;
            case 3:
                $("#section-6").css("visibility", "hidden");
        }
    }


}


export default GameManager;
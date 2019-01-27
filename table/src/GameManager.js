import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import GameWidget from "./GameWidget/GameWidget";

class GameManager {

    constructor() {

        this.socket = io.connect('http://localhost:4444');

        this.jauges = {};

        let self = this;
        self.init = true;
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

        this.socket.on('joined', data => {
            $("#qr_"+data.player).hide();
        });



        this.socket.on('start', data => {
            self.showMap();
            let nbPlayers = Object.keys(data.jauges).length;
            if(self.init){
                self.showMap();
                self.adaptTable(nbPlayers);
                self.initWidgets(nbPlayers);
                self.init = false;
                this.jauges = data.jauges;
            }

            self.updateJauges(data.jauges);

        });

        this.gameRoom = null;

    }

    updateJauges(jauges) {

        for (let playerId in jauges) {
            for (let jaugeName in jauges[playerId]) {
                let delta = this.jauges[playerId][jaugeName] - jauges[playerId][jaugeName];
                if (delta !== 0) {
                    this.jauges[playerId][jaugeName] = jauges[playerId][jaugeName];
                }
                $("#substract-"+ jaugeName +"-level-p"+playerId).css("height", (delta*10)+"%");
                $("#substract-"+ jaugeName +"-level-p"+playerId).css("top", ((10 - (jauges[playerId][jaugeName] + delta)) * 10)+"%");
                if (delta > 0)
                    $("#"+ jaugeName +"-outline-p"+playerId).css("animation-name", "jaugeblinkred");
                else if (delta < 0)
                    $("#"+ jaugeName +"-outline-p"+playerId).css("animation-name", "jaugeblinkgreen");
                $("#"+jaugeName + "-level-p" + playerId).css("height", ((10 - jauges[playerId][jaugeName]) * 10) + "%");
            }
        }

        setTimeout(function() {
            $(".substract-level").css("height", 0);
            $("div[class^=level-outline-p]").css("animation-name", "none");
        }, 6000);

    }

    ready() {
        this.socket.emit('table-ready', {room: this.gameRoom})
    }

    next() {
        this.socket.emit('next', {room: this.gameRoom})
    }

    start() {
        this.socket.emit('init', {});
        this.socket.on('init', data => {
            this.gameRoom = data.room;

            let index = this.gameRoom.indexOf("room");
            var roomId = this.gameRoom.substr(index + 1);

            for(let i = 1; i < 5; i++){
                let code = this.gameRoom.substring(4)+"-"+i;
                $('#code-list').append("<b id='code_"+ i +"'>"+code+"</b><img class='qr_code' id='qr_"+ i +"' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+code+"'/>")
            }


            this.startDiv.remove();
            this.connectDiv.show();
            $("#header").hide();

        });

    }

    showGame() {
        $("#start-btn").hide();
        $("#header").hide();
        $("#connect").hide();
        $("#main-container-board").css("display", "block");
        const mapWidget = new GameWidget(document.getElementById('app').offsetLeft,
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

        if (nbPlayer === 1) {
            $("#map").css("position", "relative");
        }

    }


    showMap() {

        console.log("show map");

        $("#start-btn").hide();
        $("#header").hide();
        $("#connect").hide();
        $("#main-container-board").css("display","block");


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
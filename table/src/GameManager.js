import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import {Observer} from "./model/Observer";
import {GameState} from "./model/GameState";

class GameManager {

    constructor() {


        this.socket = io.connect('http://localhost:4444');

        this.jauges = {};

        this.socket.on("askTableDataGame", (data) => {
            this.showGame(data.playersCount);
        });


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
            $("#connected_"+data.player).show();
        });


        this.socket.on('start', data => {
            self.showMap();
            let nbPlayers = Object.keys(data.jauges).length;
            if (self.init) {
                self.showMap();
                self.adaptTable(nbPlayers);
                self.initWidgets(nbPlayers);
                self.init = false;
                this.jauges = data.jauges;
            }

            $(".smartphone-picto").css("display", "block");

            setTimeout(function() {
                $(".smartphone-picto").css("display", "none");
                }, 6000);

            self.updateJauges(data.jauges);

        });
        this.gameRoom = null;

        this.socket.on("stateGame", (data) => {
            const players = data.players;
            for (let i = 0; i < players.length; i++) {
                this.gameState.players[i].setCoordinates(players[i].x, players[i].y);
            }
        })
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

            for (let i = 1; i < 5; i++) {
                let code = this.gameRoom.substring(4) + "-" + i;
                $('#code-list').append("<b id='code_" + i + "'>" + code + "</b><img class='qr_code' id='qr_" + i + "' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + code + "'/>")
            }


            this.startDiv.remove();
            this.connectDiv.show();
            $("#header").hide();

        });

    }

    showGame(nbPlayer) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const trueGame = document.getElementById("trueGame");
        trueGame.style.backgroundColor = "white";
        trueGame.style.display = "block";
        trueGame.style.width = "100%";
        trueGame.style.height = "100%";
        const sizeRect = height / 3;
        const halfSize = sizeRect / 2;
        this.drawRect((width / 2) - halfSize, 0, sizeRect, (height / 2));   //joueur 2
        this.drawRect(0, (height / 2) - halfSize, (height / 2), sizeRect);  //joueur 3
        this.drawRect((width / 2) - halfSize, 0.5 * height, sizeRect, (height / 2));    //joueur 1
        this.drawRect(width - (height / 2), (height / 2) - halfSize, (height / 2), sizeRect);   //joueur 4

        const playersImg = [];
        for (let i = 0; i < nbPlayer; i++) {
            const img = document.createElement('img');
            img.src = "../res/bike2.svg";
            let velo1 = true;
            /*
            setInterval(() => {
                img.src = velo1 ? "../res/bike2.svg" : "../res/bayke.svg";
                velo1 = !velo1;
            }, 200);
            */
            img.style.position = "absolute";
            img.style.width = "50px";
            img.style.height = "50px";
            switch (i) {
                case 1:
                    img.style.transform = "rotate(90deg)";
                    break;
                case 2:
                    img.style.transform = "rotate(180deg)";
                    break;
                case 3:
                    img.style.transform = "rotate(-90deg)";
                    break;
                default:
                    break;
            }
            document.body.appendChild(img);
            playersImg.push(new Observer(img));
        }

        this.gameState = new GameState(nbPlayer, playersImg);
        const state = nbPlayer === 1
            ? this.generateState1(width, height, halfSize, sizeRect)
            : nbPlayer === 2
                ? this.generateState2(width, height, halfSize, sizeRect)
                : nbPlayer === 3
                    ? this.generateState3(width, height, halfSize, sizeRect)
                    : this.generateState4(width, height, halfSize, sizeRect);

        this.socket.emit('gamePreparation', {
            room: this.gameRoom,
            state: state
        });
    }

    generateState1(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect,
                "top": 0.5 * height,
                "topMax": height
            }
        }
    }

    generateState2(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect,
                "top": 0.5 * height,
                "topMax": height
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect,
                "top": 0,
                "topMax": 0.5 * height
            }
        }
    }

    generateState3(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect,
                "top": 0.5 * height,
                "topMax": height
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect,
                "top": 0,
                "topMax": 0.5 * height
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height - halfSize + sizeRect
            }
        }
    }

    generateState4(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect,
                "top": 0.5 * height,
                "topMax": height
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect,
                "top": 0,
                "topMax": 0.5 * height
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height - halfSize + sizeRect
            },
            "player4": {
                "x": this.gameState.players[3].x,
                "y": this.gameState.players[3].y,
                "left": width - 0.5 * height,
                "leftMax": width,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height
            }
        }
    }

    drawRect(leftMargin, topMargin, width, height) {
        const rectangle = document.createElement('div');
        //rectangle.style.border = "2px black solid";
        rectangle.style.backgroundColor = "orange";
        rectangle.style.position = "absolute";
        rectangle.style.top = topMargin + "px";
        rectangle.style.left = leftMargin + "px";
        rectangle.style.width = width + "px";
        rectangle.style.height = height + "px";
        document.body.appendChild(rectangle);
    }

    initWidgets(nbPlayer) {
        this.mapWidget = new MapWidget(document.getElementById('app').offsetLeft,
            document.getElementById('app').parentElement.parentElement.offsetTop,
            document.getElementById('app').offsetWidth,
            document.getElementById('app').offsetHeight);
        $('#app').append(this.mapWidget.domElem);

        if (nbPlayer >= 1) {
            const rationWidgetP1 = new RationWidget('ration-p1', '1', this.gameRoom,
                document.getElementById('ration-container-p1').offsetLeft,
                document.getElementById('ration-container-p1').offsetTop,
                document.getElementById('ration-container-p1').offsetWidth,
                document.getElementById('ration-container-p1').offsetHeight);
            $('#ration-container-p1').append(rationWidgetP1.domElem);
        }
        if (nbPlayer >= 2) {
            const rationWidgetP2 = new RationWidget('ration-p2', '2', this.gameRoom,
                document.getElementById('ration-container-p2').offsetLeft,
                document.getElementById('ration-container-p2').offsetTop,
                document.getElementById('ration-container-p2').offsetWidth,
                document.getElementById('ration-container-p2').offsetHeight);
            $('#ration-container-p2').append(rationWidgetP2.domElem);
        }

        if (nbPlayer >= 3) {
            const rationWidgetP3 = new RationWidget('ration-p3', '3', this.gameRoom,
                document.getElementById('ration-container-p3').offsetLeft,
                document.getElementById('ration-container-p3').offsetTop,
                document.getElementById('ration-container-p3').offsetWidth,
                document.getElementById('ration-container-p3').offsetHeight);
            $('#ration-container-p3').append(rationWidgetP3.domElem);
        }

        if (nbPlayer === 4) {
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
        $("#main-container-board").css("display", "block");


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
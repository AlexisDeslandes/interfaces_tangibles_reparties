import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import {GameState} from "./model/GameState";

class GameManager {

    constructor() {

        this.players = [];

        this.change = true;

        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = document.getElementById("gamer");
        canvas.display = "block";
        canvas.width = width;
        canvas.height = height;
        const contextGamer = canvas.getContext("2d");


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
            $("#qr_" + data.player).hide();
            $("#connected_" + data.player).show();
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

            setTimeout(function () {
                $(".smartphone-picto").css("display", "none");
            }, 6000);

            self.updateJauges(data.jauges);

        });
        this.gameRoom = null;

        //let change = true;

        this.socket.on("stateGame", (data) => {
            this.players = data.players;
            //change = !change;
        })
    }

    updateJauges(jauges) {

        for (let playerId in jauges) {
            for (let jaugeName in jauges[playerId]) {
                let delta = this.jauges[playerId][jaugeName] - jauges[playerId][jaugeName];
                if (delta !== 0) {
                    this.jauges[playerId][jaugeName] = jauges[playerId][jaugeName];
                }
                $("#substract-" + jaugeName + "-level-p" + playerId).css("height", (delta * 10) + "%");
                $("#substract-" + jaugeName + "-level-p" + playerId).css("top", ((10 - (jauges[playerId][jaugeName] + delta)) * 10) + "%");
                if (delta > 0)
                    $("#" + jaugeName + "-outline-p" + playerId).css("animation-name", "jaugeblinkred");
                else if (delta < 0)
                    $("#" + jaugeName + "-outline-p" + playerId).css("animation-name", "jaugeblinkgreen");
                $("#" + jaugeName + "-level-p" + playerId).css("height", ((10 - jauges[playerId][jaugeName]) * 10) + "%");
            }
        }

        setTimeout(function () {
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
        const canvas = document.getElementById("trueGame");
        const canvas2 = document.getElementById("gamer");
        canvas2.style.display = "block";
        canvas.style.display = "block";
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const sizeRect = height / 3;
        const halfSize = sizeRect / 2;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.drawRect(ctx, (width / 2) - halfSize, 0, sizeRect, (height / 2));   //joueur 2
        this.drawRect(ctx, 0, (height / 2) - halfSize, (height / 2), sizeRect);  //joueur 3
        this.drawRect(ctx, (width / 2) - halfSize, 0.5 * height, sizeRect, (height / 2));    //joueur 1
        this.drawRect(ctx, width - (height / 2), (height / 2) - halfSize, (height / 2), sizeRect);   //joueur 4

        this.gameState = new GameState(nbPlayer);
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

        this.count = 0;

        const loop = () => {
            const bike = document.getElementById(this.change ? 'bike' : 'bike2');
            const canvas = document.getElementById("gamer");
            const contextGamer = canvas.getContext("2d");
            contextGamer.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < this.players.length; i++) {
                if (i === 1) {
                    contextGamer.rotate(Math.PI);
                } else if (i === 2) {
                    contextGamer.rotate(90 * Math.PI / 180);
                } else if (i === 3) {
                    contextGamer.rotate(-90 * Math.PI / 180);
                }
                contextGamer.drawImage(bike, this.players[i].x, this.players[i].y, 50, 100);
                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
            this.count = (this.count + 1) % 10;
            if (this.count === 0) {
                this.change = !this.change;
            }
            requestAnimationFrame(loop)
        };

        requestAnimationFrame(loop);
    }

    generateState1(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect - 50,
                "top": 0.5 * height,
                "topMax": height - 100
            }
        }
    }

    generateState2(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect - 50,
                "top": 0.5 * height,
                "topMax": height - 100
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect - 50,
                "top": 0,
                "topMax": 0.5 * height - 100
            }
        }
    }

    generateState3(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect - 50,
                "top": 0.5 * height,
                "topMax": height - 100
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect - 50,
                "top": 0,
                "topMax": 0.5 * height - 100
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height - 100,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height - halfSize + sizeRect - 50
            }
        }
    }

    generateState4(width, height, halfSize, sizeRect) {
        return {
            "player1": {
                "x": this.gameState.players[0].x,
                "y": this.gameState.players[0].y,
                "left": (width / 2) - halfSize,
                "leftMax": (width / 2) - halfSize + sizeRect - 50,
                "top": 0.5 * height,
                "topMax": height - 100
            },
            "player2": {
                "x": this.gameState.players[1].x,
                "y": this.gameState.players[1].y,
                "left": 0.5 * width - halfSize,
                "leftMax": 0.5 * width - halfSize + sizeRect - 50,
                "top": 0,
                "topMax": 0.5 * height - 100
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height - 100,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height - halfSize + sizeRect - 50
            },
            "player4": {
                "x": this.gameState.players[3].x,
                "y": this.gameState.players[3].y,
                "left": width - 0.5 * height,
                "leftMax": width - 100,
                "top": 0.5 * height - halfSize,
                "topMax": 0.5 * height - halfSize + sizeRect - 50
            }
        }
    }

    drawRect(ctx, leftMargin, topMargin, width, height) {
        ctx.fillStyle = "orange";
        ctx.fillRect(leftMargin, topMargin, width, height);
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
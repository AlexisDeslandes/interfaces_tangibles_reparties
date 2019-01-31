import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import {Observer} from "./model/Observer";
import {GameState} from "./model/GameState";
import Datamap from "datamaps/dist/datamaps.world.min";



class GameManager {

    constructor() {


        this.socket = io.connect('http://localhost:4444');

        this.jauges = {};

        this.socket.on("askTableDataGame", (data) => {
            this.showGame(data.playersCount);
        });


        let self = this;
        self.init = true;

        self.rationWidgetP1 = null;
        self.rationWidgetP2 = null;
        self.rationWidgetP3 = null;
        self.rationWidgetP4 = null;

        this.connectDiv = $("#connect");
        this.startDiv = $("#start-btn");
        this.readyBtn = $("#ready-btn");
        this.nextBtn = $("#next-btn");
        this.closePuzzleBtn = $("#close-puzzle");

        this.startDiv.click(function () {
            self.start();
        });

        this.readyBtn.click(function () {
            self.ready();
        });

        this.nextBtn.click(function () {
            self.next();
        });

        this.closePuzzleBtn.click(function () {
           self.hidePuzzle();
        });

        this.socket.on('joined', data => {
            $("#qr_" + data.player).hide();
            $("#connected_" + data.player).show();
        });


        this.socket.on('ration-used', data => {
            self.updateJauges(data.jauges);
        });


        this.socket.on('get-puzzle', data => {
            console.log('get-puzzle');
            this.showPuzzle();
            //update puzzle data
        });



        this.socket.on('start', data => {
            self.showMap();
            self.hidePuzzle();
            let nbPlayers = Object.keys(data.jauges).length;
            if (self.init) {
                self.showMap();
                self.adaptTable(nbPlayers);
                self.initWidgets(nbPlayers);
                self.init = false;
                this.jauges = data.jauges;
                self.initCanvas(nbPlayers);
            }

            $(".smartphone-picto").css("display", "block");

            setTimeout(function () {
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

    initCanvas(nb) {
        for (let i = 1; i <= nb; i++) {
            $("#jean-p" + i).css("display", "block");
            $("#bike-p" + i).css("display", "block");
        }
        const jeanP1 = $("#jean-p1");
        const bikeP1 = $("#bike-p1");
        const ctxJeanP1 = jeanP1[0].getContext("2d");
        const ctxBikeP1 = bikeP1[0].getContext("2d");
        const jeanP2 = $("#jean-p2");
        const bikeP2 = $("#bike-p2");
        const ctxJeanP2 = jeanP2[0].getContext("2d");
        const ctxBikeP2 = bikeP2[0].getContext("2d");
        const jeanP3 = $("#jean-p3");
        const bikeP3 = $("#bike-p3");
        const ctxJeanP3 = jeanP3[0].getContext("2d");
        const ctxBikeP3 = bikeP3[0].getContext("2d");
        const jeanP4 = $("#jean-p4");
        const bikeP4 = $("#bike-p4");
        const ctxJeanP4 = jeanP4[0].getContext("2d");
        const ctxBikeP4 = bikeP4[0].getContext("2d");

        switch (nb) {
            case 1:
                const jeanWidth = 0.2 * $(window).width();
                const jeanHeight = 0.28 * $(window).height();
                bikeP1.attr("width", 0.38 * $(window).width());
                bikeP1.attr("height", 0.28 * $(window).height());
                bikeP1.css("bottom", 0.01 * $(window).height());
                bikeP1.css("left", 0.01 * $(window).width());
                jeanP1.attr("width", jeanWidth);
                jeanP1.attr("height", jeanHeight);
                jeanP1.css("bottom", 0.01 * $(window).height());
                jeanP1.css("right", 0.1 * $(window).width());

                this.drawJean(ctxJeanP1, jeanWidth, jeanHeight, 5);

                break;
            case 2:
                bikeP1.attr("width", 0.23 * $(window).width());
                bikeP1.attr("height", 0.28 * $(window).height());
                bikeP1.css("bottom", 0.01 * $(window).height());
                bikeP1.css("left", 0.01 * $(window).width());
                jeanP1.attr("width", 0.20 * $(window).width());
                jeanP1.attr("height", 0.4 * $(window).height());
                jeanP1.css("bottom", 0.01 * $(window).height());
                jeanP1.css("right", 0.1 * $(window).width());

                bikeP2.attr("width", 0.23 * $(window).width());
                bikeP2.attr("height", 0.28 * $(window).height());
                bikeP2.css("top", 0.01 * $(window).height());
                bikeP2.css("right", 0.01 * $(window).width());
                jeanP2.attr("width", 0.20 * $(window).width());
                jeanP2.attr("height", 0.40 * $(window).height());
                jeanP2.css("top", 0.01 * $(window).height());
                jeanP2.css("left", 0.03 * $(window).width());
                break;
            case 3:
            case 4:
                bikeP1.attr("width", 0.23 * $(window).width());
                bikeP1.attr("height", 0.28 * $(window).height());
                bikeP1.css("bottom", 0.01 * $(window).height());
                bikeP1.css("left", 0.01 * $(window).width());
                jeanP1.attr("width", 0.20 * $(window).width());
                jeanP1.attr("height", 0.4 * $(window).height());
                jeanP1.css("bottom", 0.01 * $(window).height());
                jeanP1.css("right", 0.03 * $(window).width());

                bikeP2.attr("width", 0.23 * $(window).width());
                bikeP2.attr("height", 0.28 * $(window).height());
                bikeP2.css("top", 0.01 * $(window).height());
                bikeP2.css("right", 0.01 * $(window).width());
                jeanP2.attr("width", 0.20 * $(window).width());
                jeanP2.attr("height", 0.40 * $(window).height());
                jeanP2.css("top", 0.01 * $(window).height());
                jeanP2.css("left", 0.03 * $(window).width());

                bikeP3.attr("width", 0.23 * $(window).width());
                bikeP3.attr("height", 0.28 * $(window).height());
                bikeP3.css("bottom", 0.01 * $(window).height());
                bikeP3.css("left", 0.01 * $(window).width());
                jeanP3.attr("width", 0.20 * $(window).width());
                jeanP3.attr("height", 0.4 * $(window).height());
                jeanP3.css("bottom", 0.01 * $(window).height());
                jeanP3.css("right", 0.03 * $(window).width());

                bikeP4.attr("width", 0.23 * $(window).width());
                bikeP4.attr("height", 0.28 * $(window).height());
                bikeP4.css("top", 0.01 * $(window).height());
                bikeP4.css("right", 0.01 * $(window).width());
                jeanP4.attr("width", 0.20 * $(window).width());
                jeanP4.attr("height", 0.40 * $(window).height());
                jeanP4.css("top", 0.01 * $(window).height());
                jeanP4.css("left", 0.03 * $(window).width());
        }
    }


    showPuzzleToAll(){
        $("#puzzle").toggle();
        this.socket.emit('show-puzzle-on-table',{room : this.gameRoom})
    }

    showPuzzle(){
        $("#puzzle").show();
    }

    hidePuzzle(){
        $("#puzzle").hide();
    }

    drawJean(ctx, jeanWidth, jeanHeight, width) {
        const center = jeanWidth / 2;
        const left = jeanWidth / 2.5;
        const right = 2 * center - left;
        const middle = jeanHeight / 2;
        const up = jeanHeight / 4;
        const down = 5.2 * jeanHeight / 6;
        const headRadius = jeanHeight / 8;
        // HEAD
        this.drawCircle(ctx, center, up, headRadius, width);
        // BODY
        this.drawLine(ctx, center, up + headRadius, center, middle + 1.5 * headRadius, width);
        // LEFT LEG
        this.drawLine(ctx, center, middle + 1.5 * headRadius, left, down, width);
        // RIGHT LEG
        this.drawLine(ctx, center, middle + 1.5 * headRadius, right, down, width);
        // LEFT ARM
        this.drawLine(ctx, center, middle, left, 3 * headRadius, width);
        // RIGHT ARM
        this.drawLine(ctx, center, middle, right, 3 * headRadius, width);
        // EYES
        this.fillCircle(ctx, center - headRadius / 3, up - headRadius / 5, width);
        this.fillCircle(ctx, center + headRadius / 3, up - headRadius / 5, width);
        // MOUTH
        this.drawMouth(ctx, center, up + headRadius / 8, headRadius / 2, 0, Math.PI, false, width);
    }

    drawMouth(ctx, x, y, r, start, end, ccw, width) {
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI, false);
        ctx.stroke();
    }

    fillCircle(ctx, x, y, r) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(x, y, r, r, 360);
        ctx.fill();
    }


    drawCircle(ctx, x, y, r, w) {
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.arc(x, y, r, r, 360);
        ctx.stroke();
    }

    drawLine(ctx, x1, y1, x2, y2, w) {
        ctx.lineWidth = w;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    updateJauges(jauges) {

        for (let playerId in jauges) {
            const canvas = $("#jean-p" + playerId)[0];
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.drawJean(ctx, canvas.width, canvas.height, jauges[playerId]["chicken"]/2);
        }

        /*
        for (let playerId in jauges) {
            for (let jaugeName in jauges[playerId]) {
                let delta = this.jauges[playerId][jaugeName] - jauges[playerId][jaugeName];
                if (delta !== 0) {
                    this.jauges[playerId][jaugeName] = jauges[playerId][jaugeName];
                }
            }
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
        }, 6000);*/
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
        if (nbPlayer >= 1) {
            const rationWidgetP1 = new RationWidget('ration-p1', '1', this.gameRoom,
                document.getElementById('ration-container-p1').getBoundingClientRect().left,
                document.getElementById('ration-container-p1').getBoundingClientRect().top,
                document.getElementById('ration-container-p1').getBoundingClientRect().width,
                document.getElementById('ration-container-p1').getBoundingClientRect().height);
            $('#ration-container-p1').append(rationWidgetP1.domElem);
        }
        if (nbPlayer >= 2) {
            const rationWidgetP2 = new RationWidget('ration-p2', '2', this.gameRoom,
                document.getElementById('ration-container-p2').getBoundingClientRect().left,
                document.getElementById('ration-container-p2').getBoundingClientRect().top,
                document.getElementById('ration-container-p2').getBoundingClientRect().width,
                document.getElementById('ration-container-p2').getBoundingClientRect().height);
            $('#ration-container-p2').append(rationWidgetP2.domElem);
        }

        if (nbPlayer >= 3) {
            const rationWidgetP3 = new RationWidget('ration-p3', '3', this.gameRoom,
                document.getElementById('ration-container-p3').getBoundingClientRect().left,
                document.getElementById('ration-container-p3').getBoundingClientRect().top,
                document.getElementById('ration-container-p3').getBoundingClientRect().width,
                document.getElementById('ration-container-p3').getBoundingClientRect().height);
            $('#ration-container-p3').append(rationWidgetP3.domElem);
        }

        if (nbPlayer === 4) {
            const rationWidgetP4 = new RationWidget('ration-p4', '4', this.gameRoom,
                document.getElementById('ration-container-p4').getBoundingClientRect().left,
                document.getElementById('ration-container-p4').getBoundingClientRect().top,
                document.getElementById('ration-container-p4').getBoundingClientRect().width,
                document.getElementById('ration-container-p4').getBoundingClientRect().height);
            $('#ration-container-p4').append(rationWidgetP4.domElem);
        }

        if (nbPlayer === 1) {
            $("#map").css("position", "relative");
        }
        this.mapWidget = new MapWidget(
            document.getElementById('app').getBoundingClientRect().left,
            document.getElementById('app').getBoundingClientRect().top,
            document.getElementById('app').getBoundingClientRect().width,
            document.getElementById('app').getBoundingClientRect().height);
        $('#app').append(this.mapWidget.domElem);
        this.mapWidget.addMap();




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
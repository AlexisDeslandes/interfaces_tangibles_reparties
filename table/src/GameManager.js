import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import {GameState} from "./model/GameState";
import Datamap from "datamaps/dist/datamaps.world.min";



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


        this.socket = io.connect('http://192.168.1.33:4444');
        //this.socket = io.connect('http://localhost:4444');

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
            if (data.hasOwnProperty('puzzle')) {
                let ctn = $('#puzzle-parent');
                ctn.empty();
                data.puzzle.forEach(p => {
                    let img;
                    if (p.shown) img = "<img src='../res/puzzle1/" + p.picture + "' class='slide-in-fwd-center'/>";
                    else img = "<img src='../res/puzzle1/hidden2.png' style='padding-top: 2px' class='slide-in-fwd-center'/>"
                    ctn.append(
                        "<div class='puzzle-child' id='" + p.picture + "'>" +
                        img +
                        "" +
                        "</div>"
                    );
                });
                this.showPuzzle();
            }
        });

        this.socket.on('puzzle-ended', () => {
            console.log("puzzle ended");
            $('#puzzle-parent').hide();
            $('#puzzle-result').show();
            $('#puzzle-title').hide();
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

        //let change = true;

        this.socket.on("stateGame", (data) => {
            this.players = data.players;
            //change = !change;
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

        const substractChickenP1 = $("#substract-chicken-p1");
        const substractMoodP1 = $("#substract-mood-p1");


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
                substractChickenP1.css("width", jeanWidth / 12);
                substractChickenP1.css("height", jeanWidth / 12);
                substractChickenP1.css("bottom", 0.01 * $(window).height() + jeanHeight / 2 - jeanWidth / 12);
                substractChickenP1.css("right", 0.1 * $(window).width() + jeanWidth / 2 - jeanWidth / 24);
                substractChickenP1.css("border-radius", jeanWidth / 12 + "px " + jeanWidth / 12 + "px");
                substractMoodP1.css("width", jeanWidth / 3.5);
                substractMoodP1.css("height", jeanWidth / 3.5);
                substractMoodP1.css("bottom", 0.01 * $(window).height() + jeanHeight*0.65);
                substractMoodP1.css("right", 0.1 * $(window).width() + jeanWidth / 2 - jeanWidth / 7);
                substractMoodP1.css("border-radius", jeanWidth / 3.5 + "px " + jeanWidth / 3.5 + "px");

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


    showPuzzleToAll() {
        $("#puzzle").toggle();
        this.socket.emit('show-puzzle-on-table', {room: this.gameRoom})
    }

    showPuzzle() {
        $("#puzzle").show();
    }

    hidePuzzle() {
        $("#puzzle").hide();
    }

    drawJean(ctx, jeanWidth, jeanHeight, chicken, mood) {
        const center = jeanWidth / 2;
        const left = jeanWidth / 2.5;
        const right = 2 * center - left;
        const middle = jeanHeight / 2;
        const up = jeanHeight / 4;
        const down = 5.2 * jeanHeight / 6;
        const headRadius = jeanHeight / 8;
        const width = chicken/2;
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
        // MOUTH
        this.drawMouth(ctx, center, up + headRadius / 8, headRadius / 2, 0, Math.PI, width, mood);
        // EYES
        this.fillCircle(ctx, center - headRadius / 3, up - headRadius / 5, width);
        this.fillCircle(ctx, center + headRadius / 3, up - headRadius / 5, width);
    }

    drawMouth(ctx, x, y, r, start, end, width, mood) {
        if (mood > 6) {
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI, false);
            ctx.stroke();
        }
        else if (mood > 3 && mood <= 6) {
            this.drawLine(ctx, x - r, y + r/3, x + r, y + r/3, width);
        }
        else {
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.arc(x, y + r, r*0.8, 0, Math.PI, true);
            ctx.stroke();
        }
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
            this.drawJean(ctx, canvas.width, canvas.height, jauges[playerId]["chicken"], jauges[playerId]["mood"]);
            for (let jaugeName in jauges[playerId]) {
                let delta = this.jauges[playerId][jaugeName] - jauges[playerId][jaugeName];
                if (delta !== 0) {
                    this.jauges[playerId][jaugeName] = jauges[playerId][jaugeName];
                }
                $("#substract-" + jaugeName + "-level-p" + playerId).css("height", (delta * 10) + "%");
                $("#substract-" + jaugeName + "-level-p" + playerId).css("top", ((10 - (jauges[playerId][jaugeName] + delta)) * 10) + "%");
                if (delta > 0)
                    $("#substract-" + jaugeName + "-p" + playerId).css("animation-name", "jaugeblinkred");
                else if (delta < 0)
                    $("#substract-" + jaugeName + "-p" + playerId).css("animation-name", "jaugeblinkgreen");

                $("#substract-" + jaugeName + "-level-p" + playerId).css("height", (delta * 10) + "%");
                $("#substract-" + jaugeName + "-level-p" + playerId).css("top", ((10 - (jauges[playerId][jaugeName] + delta)) * 10) + "%");
                if (delta > 0)
                    $("#" + jaugeName + "-outline-p" + playerId).css("animation-name", "jaugeblinkred");
                else if (delta < 0)
                    $("#" + jaugeName + "-outline-p" + playerId).css("animation-name", "jaugeblinkgreen");
                $("#" + jaugeName + "-level-p" + playerId).css("height", ((10 - jauges[playerId][jaugeName]) * 10) + "%");
                    $("#" + jaugeName + "-outline-p" + playerId).css("animation-name", "jaugeblinkgreen");
                $("#" + jaugeName + "-level-p" + playerId).css("height", ((10 - jauges[playerId][jaugeName]) * 10) + "%");

            }
        }

        setTimeout(function () {
        setTimeout(function () {
            $("div[class^=substract]").css("animation-name", "none");
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


            //this.socket.emit('get-puzzle', {room: data.room});


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
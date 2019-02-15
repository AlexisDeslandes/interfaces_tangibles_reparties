import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';
import MapWidget from './MapWidget/MapWidget'
import RationWidget from './RationWidget/RationWidget';
import {GameState} from "./model/GameState";


class GameManager {

    constructor() {

        const runSound = ['../res/sounds/valid.wav', '../res/sounds/valid.wav', '../res/sounds/valid.wav', '../res/sounds/valid.wav', '../res/sounds/valid.wav'];

        this.isClean = false;

        this.players = [];

        this.change = true;

        //this.socket = io.connect('http://10.188.26.122:4444');
        this.socket = io.connect('http://localhost:4444');
        this.jauges = {};
        this.socket.on("askTableDataGame", (data) => {
            this.isClean = false;
            this.showGame(data.playersCount, data.state);
        });

        this.socket.on('clean', () => {
            console.log("It's cleaning");
            this.isClean = true;
        });

        this.socket.on('clearCanvas', () => {
            console.log("It's cleaning");
            document.getElementById('trueGame').style.display = "none";
            document.getElementById('gamer').style.display = "none";
            this.isClean = true;
        });

        let idAudio = 0;

        this.socket.on('nextAudio', () => {
            const audio = new Audio(runSound[idAudio++]);
            audio.play();
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
            let audio = new Audio('../res/sounds/connect.wav');
            audio.play();
            $("#qr_" + data.player).hide();
            $("#connected_" + data.player).show();
        });


        this.socket.on('ration-used', data => {
            self.updateJauges(data.jauges);
        });


        this.socket.on('get-puzzle', data => {
            if (data.hasOwnProperty('puzzle')) {
                let audio = new Audio('../res/sounds/valid.wav');
                audio.play();
                let ctn = $('#puzzle-parent');
                ctn.empty();
                let puzzleName = data.puzzle.name
                data.puzzle.parts.forEach(p => {
                    let img;
                    if (p.shown) img = "<img src='../res/" + puzzleName + "/" + p.picture + "' class='slide-in-fwd-center'/>";
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

        this.socket.on('puzzle-ended', (m) => {
            console.log("puzzle ended");
            $('#puzzle-parent').hide();
            console.log('puzzle-ended', m)
            if (m.puzzle === 'puzzle1')

                $('#result-img').attr('src', 'res/puzzle1/full.jpg');
            else
                $('#result-img').attr('src', 'res/puzzle2/full.jpg');

            $('#puzzle-result').show()
            $('#puzzle-title').hide();
        });


        this.socket.on('start', data => {
            let audio = new Audio('../res/sounds/netflix.mp3');
            audio.play();
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

            const intro = data.step["intro"];

            let msg1 = new SpeechSynthesisUtterance(intro[0]["text"]);
            window.speechSynthesis.speak(msg1);

            msg1.onend = function() {

                if (intro.length > 1) {
                    let msg2 = new SpeechSynthesisUtterance(intro[1]["text"]);
                    window.speechSynthesis.speak(msg2);
                }
            };


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

        this.bike = document.getElementById(this.change ? 'bike' : 'bike2');
        this.obstacle = document.getElementById('obstacle');
        this.canvas = document.getElementById("gamer");
        this.contextGamer = this.canvas.getContext("2d");
        this.speed = document.getElementById('speed');
        this.sand = document.getElementById('sandImg');

    }

    initCanvas(nb) {
        for (let i = 1; i <= nb; i++) {
            $("#img-jean-p" + i).css("display", "block");
            $("#bike-p" + i).css("display", "block");
            $("#water-p" + i).css("display", "block");
            $("#water-level-p" + i).css("display", "block");
            $("#energy-p" + i).css("display", "block");
            $("#energy-level-p" + i).css("display", "block");
        }

        const jeanP1 = $("#img-jean-p1");
        const jeanP2 = $("#img-jean-p2");
        const jeanP3 = $("#img-jean-p3");
        const jeanP4 = $("#img-jean-p4");

        jeanP1.attr("src", "res/jean/player-1-mood-5-chicken-5.png");
        jeanP2.attr("src", "res/jean/player-2-mood-5-chicken-5.png");
        jeanP3.attr("src", "res/jean/player-3-mood-5-chicken-5.png");
        jeanP4.attr("src", "res/jean/player-4-mood-5-chicken-5.png");

        const bikeP1 = $("#bike-p1");
        const bikeP2 = $("#bike-p2");
        const bikeP3 = $("#bike-p3");
        const bikeP4 = $("#bike-p4");

        const waterP1 = $("#water-p1");
        const waterP2 = $("#water-p2");
        const waterP3 = $("#water-p3");
        const waterP4 = $("#water-p4");
        const waterLevelP1 = $("#water-level-p1");
        const waterLevelP2 = $("#water-level-p2");
        const waterLevelP3 = $("#water-level-p3");
        const waterLevelP4 = $("#water-level-p4");

        const energyP1 = $("#energy-p1");
        const energyP2 = $("#energy-p2");
        const energyP3 = $("#energy-p3");
        const energyP4 = $("#energy-p4");
        const energyLevelP1 = $("#energy-level-p1");
        const energyLevelP2 = $("#energy-level-p2");
        const energyLevelP3 = $("#energy-level-p3");
        const energyLevelP4 = $("#energy-level-p4");

        let jeanWidth, jeanHeight, mx, my;

        switch (nb) {
            case 1:
                jeanWidth = 0.2 * $(window).width();
                jeanHeight = 0.28 * $(window).height();
                mx = 0.1 * $(window).width();
                my = 0.01 * $(window).height();

                jeanP1.attr("height", jeanHeight);
                jeanP1.css("bottom", 8 * my);
                jeanP1.css("right", mx);

                bikeP1.css("width", jeanWidth);
                bikeP1.css("height", jeanHeight);
                bikeP1.css("bottom", my);
                bikeP1.css("left", mx);

                waterP1.css("left", 1.2 * mx + jeanWidth + 2);
                waterP1.css("bottom", 8 * my - 2);
                waterLevelP1.css("left", 1.2 * mx + jeanWidth + 2);
                waterLevelP1.css("bottom", 8 * my - 1);

                energyP1.css("right", 1.2 * mx + jeanWidth + 2);
                energyP1.css("bottom", 8 * my - 2);
                energyLevelP1.css("right", 1.2 * mx + jeanWidth + 5);
                energyLevelP1.css("bottom", 8 * my - 1);

                break;
            case 2:
                jeanWidth = 0.2 * $(window).width();
                jeanHeight = 0.4 * $(window).height();
                mx = 0.03 * $(window).width();
                my = 0.01 * $(window).height();

                jeanP1.attr("height", jeanHeight);
                jeanP1.css("bottom", 8 * my);
                jeanP1.css("right", 2 * mx);

                bikeP1.css("width", jeanWidth);
                bikeP1.css("height", jeanHeight);
                bikeP1.css("bottom", -8 * my);
                bikeP1.css("left", mx);

                waterP1.css("left", 2 * mx + jeanWidth + 2);
                waterP1.css("bottom", 8 * my - 2);
                waterLevelP1.css("left", 2 * mx + jeanWidth + 2);
                waterLevelP1.css("bottom", 8 * my - 1);

                energyP1.css("right", 2 * mx + jeanWidth + 2);
                energyP1.css("bottom", 8 * my - 2);
                energyLevelP1.css("right", 2 * mx + jeanWidth + 5);
                energyLevelP1.css("bottom", 8 * my - 1);

                jeanP2.attr("height", jeanHeight);
                jeanP2.css("top", 8 * my);
                jeanP2.css("left", 2 * mx);

                bikeP2.css("width", jeanWidth);
                bikeP2.css("height", jeanHeight);
                bikeP2.css("top", -8 * my);
                bikeP2.css("right", mx);

                waterP2.css("right", 2 * mx + jeanWidth - 3);
                waterP2.css("top", 8 * my + 2);
                waterLevelP2.css("right", 2 * mx + jeanWidth - 2);
                waterLevelP2.css("top", 8 * my + 4);

                energyP2.css("left", 2 * mx + jeanWidth - 3);
                energyP2.css("top", 8 * my + 2);
                energyLevelP2.css("left", 2 * mx + jeanWidth);
                energyLevelP2.css("top", 8 * my + 4);

                break;
            case 3:
            case 4:
                jeanWidth = 0.1 * $(window).width();
                jeanHeight = 0.2 * $(window).height();
                mx = 0.28 * $(window).width();
                my = 0.01 * $(window).height();

                jeanP1.attr("height", jeanHeight);
                jeanP1.css("bottom", 2 * my);
                jeanP1.css("right", mx);

                bikeP1.css("width", jeanWidth);
                bikeP1.css("height", jeanHeight);
                bikeP1.css("bottom", my);
                bikeP1.css("left", 0.8 * mx);

                waterP1.css("left", 0.9 * mx + jeanWidth + 2);
                waterP1.css("bottom", 8 * my - 2);
                waterLevelP1.css("left", 0.9 * mx + jeanWidth + 2);
                waterLevelP1.css("bottom", 8 * my - 1);

                energyP1.css("right", 0.9 * mx + jeanWidth + 2);
                energyP1.css("bottom", 8 * my - 2);
                energyLevelP1.css("right", 0.9 * mx + jeanWidth + 3);
                energyLevelP1.css("bottom", 8 * my - 1);


                jeanP2.attr("height", jeanHeight);
                jeanP2.css("top", 2 * my);
                jeanP2.css("left", mx);

                bikeP2.css("width", jeanWidth);
                bikeP2.css("height", jeanHeight);
                bikeP2.css("top", my);
                bikeP2.css("right", 0.8 * mx);

                waterP2.css("right", 0.9 * mx + jeanWidth + 2);
                waterP2.css("top", 8 * my + 2);
                waterLevelP2.css("right", 0.9 * mx + jeanWidth + 2);
                waterLevelP2.css("top", 8 * my + 4);

                energyP2.css("left", 0.9 * mx + jeanWidth + 2);
                energyP2.css("top", 8 * my + 2);
                energyLevelP2.css("left", 0.9 * mx + jeanWidth + 3);
                energyLevelP2.css("top", 8 * my + 4);

                jeanP3.attr("height", jeanHeight);
                jeanP3.css("bottom", 3 * my);
                jeanP3.css("left", 8 * my);

                bikeP3.css("width", jeanWidth);
                bikeP3.css("height", jeanHeight);
                bikeP3.css("top", my);
                bikeP3.css("left", my);

                waterP3.css("top", my + jeanHeight + 2);
                waterP3.css("left", 8 * my);
                waterLevelP3.css("top", my + jeanHeight + 2);
                waterLevelP3.css("left", 8 * my + 1);

                energyP3.css("bottom", my + jeanHeight + 2);
                energyP3.css("left", 8 * my);
                energyLevelP3.css("bottom", my + jeanHeight + 2);
                energyLevelP3.css("left", 8 * my + 2);

                jeanP4.attr("height", jeanHeight);
                jeanP4.css("top", 3 * my);
                jeanP4.css("right", 8 * my);

                bikeP4.css("width", jeanWidth);
                bikeP4.css("height", jeanHeight);
                bikeP4.css("bottom", my);
                bikeP4.css("right", my);

                waterP4.css("bottom", my + jeanHeight + 2);
                waterP4.css("right", 8 * my);
                waterLevelP4.css("bottom", my + jeanHeight + 2);
                waterLevelP4.css("right", 8 * my + 1);

                energyP4.css("top", my + jeanHeight + 2);
                energyP4.css("right", 8 * my);
                energyLevelP4.css("top", my + jeanHeight + 2);
                energyLevelP4.css("right", 8 * my + 3);

                break;
        }
    }


    showPuzzleToAll() {
        $("#puzzle").toggle();
        this.socket.emit('show-puzzle-on-table', {room: this.gameRoom, puzzle: 'puzzle1'})
    }

    showPuzzle() {
        $("#puzzle").show();
    }

    hidePuzzle() {
        $("#puzzle").hide();
    }

    drawJean(ctx, jeanWidth, jeanHeight, chicken, mood, nbPlayers) {
        const center = jeanWidth / 2;
        const left = jeanWidth / 2.5;
        const right = 2 * center - left;
        const middle = jeanHeight / 2;
        const up = jeanHeight / 4;
        const down = 5.2 * jeanHeight / 6;
        const headRadius = jeanHeight / 8;
        let width;
        if (nbPlayers <= 2) {
            width = chicken;
        }
        else {
            width = 0.6 * chicken;
        }
        // HEAD
        this.drawCircle(ctx, center, up, headRadius, width);
        // BODY
        this.drawLine(ctx, center, up + headRadius, center, middle + 1.5 * headRadius, width);
        // LEFT LEG
        this.drawLine(ctx, center, middle + 1.5 * headRadius, left, down, width);
        // RIGHT LEG
        this.drawLine(ctx, center, middle + 1.5 * headRadius, right, down, width);
        // ARMS
        let armPos;
        if (mood > 6)
            armPos = 3;
        else if (mood > 3 && mood <= 6) {
            armPos = 5;
        }
        else
            armPos = 6;
        this.drawLine(ctx, center, middle, left, armPos * headRadius, width);
        this.drawLine(ctx, center, middle, right, armPos * headRadius, width);
        // MOUTH
        this.drawMouth(ctx, center, up + headRadius / 8, headRadius / 2, 0, Math.PI, width / 2, mood);
        // EYES
        this.fillCircle(ctx, center - headRadius / 3, up - headRadius / 5, width / 2);
        this.fillCircle(ctx, center + headRadius / 3, up - headRadius / 5, width / 2);
    }

    drawMouth(ctx, x, y, r, start, end, width, mood) {
        if (mood > 6) {
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI, false);
            ctx.stroke();
        }
        else if (mood > 3 && mood <= 6) {
            this.drawLine(ctx, x - r, y + r / 3, x + r, y + r / 3, width);
        }
        else {
            ctx.lineWidth = width;
            ctx.beginPath();
            ctx.arc(x, y + r, r * 0.8, 0, Math.PI, true);
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

            for (let jaugeName in jauges[playerId]) {
                let delta = this.jauges[playerId][jaugeName] - jauges[playerId][jaugeName];
                if (delta !== 0) {
                    this.jauges[playerId][jaugeName] = jauges[playerId][jaugeName];
                }
                if (delta > 0)
                    $("#substract-" + jaugeName + "-p" + playerId).css("animation-name", "jaugeblinkred");
                else if (delta < 0)
                    $("#substract-" + jaugeName + "-p" + playerId).css("animation-name", "jaugeblinkgreen");

                if (jaugeName === "water") {
                    let height = Math.max(0, (10 - jauges[playerId][jaugeName]) * 10 - 2);
                    $("#water-level-jauge-p" + playerId).css("height", height + "%");
                }

                if (jaugeName === "energy") {
                    let energy = jauges[playerId][jaugeName];
                    let height = Math.max(0, (10 - energy) * 10 - 2);
                    $("#energy-level-jauge-p" + playerId).css("height", height + "%");
                    $("#energy-level-p" + playerId).css("background-color", "rgb(" + (10 - energy) * 25 + "," + energy * 25 + ",0)");
                }

                if (jaugeName === "bike") {
                    let redShade = 255 - ((255 / 10) * jauges[playerId][jaugeName]);
                    $("#bike-p" + playerId).css("background-color", "rgb(" + redShade + ", 0, 0)");
                    if (delta !== 0) {
                        $("#bike-p" + playerId).css("animation-name", "jaugeblinkred");
                    }
                }
            }
            let mood = Math.ceil(jauges[playerId]["mood"] / 2);
            let chicken = Math.ceil(jauges[playerId]["chicken"] / 2);
            $("#img-jean-p" + playerId).attr("src", "res/jean/player-" + playerId + "-mood-" + mood
                + "-chicken-" + chicken + ".png");
        }
        setTimeout(function () {
            $("div[id^=bike-p]").css("animation-name", "none");
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
            //$("#header").hide();

        });

    }

    showGame(nbPlayer, gameState) {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        const canvas = document.getElementById("trueGame");
        const canvas2 = document.getElementById("gamer");
        canvas2.style.display = "block";
        canvas.style.display = "block";
        canvas.width = width;
        canvas.height = height;
        canvas2.width = width;
        canvas2.height = height;
        const ctx = canvas.getContext("2d");

        const sizeRect = height / 3;
        const halfSize = sizeRect / 2;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(document.getElementById('fond'), 0, 0, width, height);

        this.drawRect(ctx, (width / 2) - halfSize, 0, sizeRect, (height / 2), 2);   //joueur 2
        this.drawRect(ctx, 0, (height / 2) - halfSize, (height / 2), sizeRect, 3);  //joueur 3
        this.drawRect(ctx, (width / 2) - halfSize, 0.5 * height, sizeRect, (height / 2), 1);    //joueur 1
        this.drawRect(ctx, width - (height / 2), (height / 2) - halfSize, (height / 2), sizeRect, 4);   //joueur 4

        this.gameState = new GameState(nbPlayer);
        const state = nbPlayer === 1
            ? this.generateState1(width, height, halfSize, sizeRect)
            : nbPlayer === 2
                ? this.generateState2(width, height, halfSize, sizeRect)
                : nbPlayer === 3
                    ? this.generateState3(width, height, halfSize, sizeRect)
                    : this.generateState4(width, height, halfSize, sizeRect);
        console.log("Game state - " + gameState);
        let soundLoop;
        switch (gameState) {
            case 'game':
                this.audio = new Audio('../res/sounds/tempete.mp3');
                this.audio.play();
                soundLoop = setInterval(() => {
                    this.audio = new Audio('../res/sounds/tempete.mp3');
                    this.audio.play();
                }, 23000);
                this.socket.emit('gamePreparation', {
                    room: this.gameRoom,
                    state: state
                });
                break;
            case 'guideline1':
                this.socket.emit('guidelinePreparation', {
                    room: this.gameRoom,
                    state: state
                });
                break;
            default:
                console.log('issue with game preparation.');
                break;
        }


        this.count = 0;

        let looping = null;

        const loop = () => {
            this.contextGamer.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let player of this.players) {
                let i = player.id;
                let id = 'bike' + (2 * i - 1).toString();
                let id2 = 'bike' + (2 * i).toString();
                this.bike = document.getElementById(this.change ? id : id2);
                this.contextGamer.drawImage(this.bike, player.x, player.y, i <= 2 ? 50 : 100, i <= 2 ? 100 : 50);
                for (let obstacle of player.obstacles) {
                    this.contextGamer.drawImage(this.obstacle, obstacle.x, obstacle.y, 50, 50);
                }
                for (let speed of player.speed) {
                    this.contextGamer.drawImage(this.speed, speed.x, speed.y, i <= 2 ? 3 : 107, i <= 2 ? 107 : 3);
                }
            }
            this.count = (this.count + 1) % 10;
            if (this.count === 0) {
                this.change = !this.change;
            }
            looping = requestAnimationFrame(loop);
            if (this.isClean) {
                if (this.audio) {
                    this.audio.pause();
                    this.audio = new Audio('../res/sounds/applause.mp3');
                    this.audio.play();
                    this.audio.currentTime = 0;
                }
                clearInterval(soundLoop);
                this.contextGamer.clearRect(0, 0, this.canvas.width, this.canvas.height);
                cancelAnimationFrame(looping);
            }
        };
        loop();
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
                "topMax": 0.5 * height - 50
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
                "topMax": 0.5 * height - 50
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height - 50,
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
                "topMax": 0.5 * height - 50
            },
            "player3": {
                "x": this.gameState.players[2].x,
                "y": this.gameState.players[2].y,
                "left": 0,
                "leftMax": 0.5 * height - 50,
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

    drawRect(ctx, leftMargin, topMargin, width, height, id) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(leftMargin, topMargin, width, height);
        ctx.fillStyle = "#000000";
        ctx.lineWidth = "5";
        ctx.rect(leftMargin, topMargin, width, height);
        ctx.stroke();
        const death = document.getElementById('death');
        switch (id) {
            case 1:
                for (let i = leftMargin; i < width + leftMargin; i += 50) {
                    ctx.drawImage(death, i, 2 * height - 50, 50, 50);
                }
                break;
            case 2:
                for (let i = leftMargin; i < width + leftMargin; i += 50) {
                    ctx.drawImage(death, i, topMargin, 50, 50);
                }
                break;
            case 3:
                for (let i = topMargin; i < topMargin + height; i += 50) {
                    ctx.drawImage(death, 0, i, 50, 50);
                }
                break;
            default:
                for (let i = topMargin; i < topMargin + height; i += 50) {
                    ctx.drawImage(death, leftMargin + width - 50, i, 50, 50);
                }
                break;
        }

    }

    initWidgets(nbPlayer) {
        if (nbPlayer >= 1) {
            const rationWidgetP1 = new RationWidget('ration-p1', '1', this.gameRoom,
                document.getElementById('ration-container-p1').getBoundingClientRect().left,
                document.getElementById('ration-container-p1').getBoundingClientRect().top,
                document.getElementById('ration-container-p1').getBoundingClientRect().width,
                document.getElementById('ration-container-p1').getBoundingClientRect().height,
                this.socket);
            $('#ration-container-p1').append(rationWidgetP1.domElem);
        }
        if (nbPlayer >= 2) {
            const rationWidgetP2 = new RationWidget('ration-p2', '2', this.gameRoom,
                document.getElementById('ration-container-p2').getBoundingClientRect().left,
                document.getElementById('ration-container-p2').getBoundingClientRect().top,
                document.getElementById('ration-container-p2').getBoundingClientRect().width,
                document.getElementById('ration-container-p2').getBoundingClientRect().height,
                this.socket);
            $('#ration-container-p2').append(rationWidgetP2.domElem);
        }

        if (nbPlayer >= 3) {
            const rationWidgetP3 = new RationWidget('ration-p3', '3', this.gameRoom,
                document.getElementById('ration-container-p3').getBoundingClientRect().left,
                document.getElementById('ration-container-p3').getBoundingClientRect().top,
                document.getElementById('ration-container-p3').getBoundingClientRect().width,
                document.getElementById('ration-container-p3').getBoundingClientRect().height,
                this.socket);
            $('#ration-container-p3').append(rationWidgetP3.domElem);
        }

        if (nbPlayer === 4) {
            const rationWidgetP4 = new RationWidget('ration-p4', '4', this.gameRoom,
                document.getElementById('ration-container-p4').getBoundingClientRect().left,
                document.getElementById('ration-container-p4').getBoundingClientRect().top,
                document.getElementById('ration-container-p4').getBoundingClientRect().width,
                document.getElementById('ration-container-p4').getBoundingClientRect().height,
                this.socket);
            $('#ration-container-p4').append(rationWidgetP4.domElem);
        }

        if (nbPlayer === 1) {
            $("#map").css("position", "relative");
        }
        this.mapWidget = new MapWidget(
            document.getElementById('app').getBoundingClientRect().left,
            document.getElementById('app').getBoundingClientRect().top,
            document.getElementById('app').getBoundingClientRect().width,
            document.getElementById('app').getBoundingClientRect().height,
            this.socket, this.gameRoom);
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
/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import { radToDeg } from 'tuiomanager/core/helpers';
import Datamap from "datamaps/dist/datamaps.world.min";
import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import CircleType from 'circletype/dist/circletype.min';


/**
 * Main class to manage MapWidget.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class MapWidget
 * @extends TUIOWidget
 */
class MapWidget extends TUIOWidget {
    /**
     * MapWidget constructor.
     *
     * @constructor
     * @param {number} x - MapWidget's upperleft coin abscissa.
     * @param {number} y - MapWidget's upperleft coin ordinate.
     * @param {number} width - MapWidget's width.
     * @param {number} height - MapWidget's height.
     */
    constructor(x, y, width, height, socket, gameRoom) {
        // alert(x +' '+ y +' '+ width + ' ' + height);Y

        super(x, y, width, height);
        this.map = null;
        this.socket = socket;
        this.gameRoom = gameRoom;
        this.labelsInit =false;
        this.cities = [];
        this._lastTouchesValues = {};
        this._lastTagsValues = {};
        let elem = $('<div id="map-container"></div>')
            .css('width', width)
            .css('height', height)
            .css('position', 'absolute')
            .css('border', '5px')
            .css('background-color', '#f4f4f4');

        // elem.append($('<img>')
        //     .attr('src', 'res/map_init.png')
        //     .attr('id', 'map')
        //     .css('width', `100%`)
        //     .css('height', `100%`)
        //     .css('visibility', `hidden`)
        //     .css('position', 'absolute'));



        this._domElem = elem;
        this.itineraire = [
            {
                name: 'Alger',
                fillKey: 'black',
                radius: 20,
                significance: 'Step 1',
                latitude: 36.731088,
                longitude: 3.087776
            },{
                name: 'Bilda',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 2',
                latitude: 36.4701645,
                longitude: 2.8287985
            },{
                name: 'Médéa',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 3',
                latitude: 36.265344,
                longitude: 2.766957
            },{
                name: 'In Salah',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 4',
                latitude: 27.1950331,
                longitude: 2.4826132
            },{
                name: 'Tessalit',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 5',
                latitude: 20.231916,
                longitude: 0.863977
            },{
                name: 'Gao',
                fillKey: 'blue',
                radius: 5,
                significance: 'Step 6',
                latitude: 16.2788129,
                longitude: -0.0412392
            },{
                name: 'Tombouctou',
                fillKey: 'black',
                radius: 20,
                significance: 'Step 7',
                latitude: 16.7719091,
                longitude: -3.0087272
            },
        ];


        this.socket.on('map-progressed', (m) => {
            console.log("map progressed");
            console.log(m);
            this.updateMap(m);
        });

        this.socket.on('map-changed', (m) => {
            console.log("map changed");
            this.map.arc(m);
        });
        console.log("MAAAAAAAAPPPPPP");
        console.log( "x= "+ this._x+ "  y= "+this._y+ " width = "+this._width+" height = "+ this._height);
        console.log(this.itineraire);
        console.log(this.itineraire[1]);
    }



    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }

    addMap(){
        this.map = new Datamap({
            element: document.getElementById("map-container"),
            scope: 'world',
            // Zoom in on Africa
            setProjection: function(element) {
                var projection = d3.geo.equirectangular()
                    .center([5, 27])
                    .rotate([0, 0])
                    .scale(1200)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                var path = d3.geo.path()
                    .projection(projection);

                return {path: path, projection: projection};
            }
            ,
            fills: {
                defaultFill: '#ABDDA4',
                blue: '#0000FF',
                black: '#000000',
                grey: '#939393'
            },
            arcConfig: {arcSharpness: 0.2}
        });

    }

    updateMap(m) {
        console.log("UpdatedM");
        let tmp = [];
        if(d3.selectAll('.rotateLabels')[0]) {
            console.log(d3.selectAll('.rotateLabels')[0]);
            d3.selectAll('.rotateLabels').remove();
            this.cities = [];
        }
        console.log("-------------------------------");
        this.map.bubbles(tmp.concat(m.progress), {
            popupOnHover: true,
            popupTemplate: function () {
                return '<div class="hoverinfo">Hello';
            }
        });
        // if(true){
        let tab = d3.selectAll('.datamaps-bubble')[0];
        console.log(d3.selectAll('.rotateLabels')[0]);
        console.log("---------------------------------");
        for (let i = 0; i < tab.length; i++) {
            if(this.cities.indexOf(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name) === -1){
                let city = JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name;
                console.log("test");
                console.log(d3.selectAll('.datamaps-bubble')[0][i]);
                var newDiv = document.createElement("div");
                if(city==="Alger" || city=== "Tombouctou") {
                    let test = document.createElement('div');
                    let flag = document.createElement('IMG');
                    flag.setAttribute('src', 'res/flag-checkered.svg');
                    flag.style.left = `${tab[i].getBoundingClientRect().left}px`;
                    flag.style.top = `${tab[i].getBoundingClientRect().top -40}px`;
                    flag.style.width = "40px";
                    flag.style.height = "40px";
                    flag.style.position = "fixed";
                    if (city === "Alger") {
                        test.innerHTML = '<p id="bubble-step'+i.toString()+'" style="font-size: 1.25rem; font-weight: 900">Alger &nbsp Alger &nbsp Alger &nbsp</p>';
                        test.style = ('left: ' + `${tab[i].getBoundingClientRect().left+(0.015*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.1*this.width)}px` + '; position: fixed; z-index: 999;'+ `${(m.step === i)?"font-size: 1.3rem; color: blue":"font-size: 1.25rem; color: black"}`+   '');
                    }else{
                        test.innerHTML ='<p id="bubble-step'+i.toString()+'" style="font-size: 1.25rem; font-weight: 900">Tombouctou  &nbsp Tombouctou &nbsp</p>';
                        test.style = ('left: ' + `${tab[i].getBoundingClientRect().left-(0.07*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.15*this.height)}px` + '; position: fixed; z-index: 999;'+ `${(m.step === i)?"font-size: 1.4rem; color: blue":"font-size: 1.1rem; color: black"}`+   '');
                    }
                    test.classList.add("rotateLabels");
                    newDiv.appendChild(test);
                    newDiv.appendChild(flag);
                }
                else{
                    var newContent = document.createTextNode(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name+"    \t "+ JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name +"   \t");
                    newDiv.classList.add("rotateLabels");
                    newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.0*this.width):tab[i].getBoundingClientRect().left-(0.0*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top - 40}px` + '; position: fixed; z-index: 999; '+ `${(m.step === i)?"font-size: 1.4rem; color: blue":"font-size: 1.1rem; color: black"}`+   '');
                    if(city==="Bilda"){
                        newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.05*this.width):tab[i].getBoundingClientRect().left-(0.066*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.04*this.width)}px` + '; position: fixed; z-index: 999; '+ `${(m.step === i)?"font-size: 1.4rem; color: blue":"font-size: 1.1rem; color: black"}`+   '');
                    }else if(city==="Tamesguida"){
                        newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.05*this.width):tab[i].getBoundingClientRect().left-(0.05*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top+(0.01*this.width)}px` + '; position: fixed; z-index: 999; '+ `${(m.step === i)?"font-size: 1.4rem; color: blue":"font-size: 1.1rem; color: black"}`+   '');
                    }else if(city==="Médéa"){
                        newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.05*this.width):tab[i].getBoundingClientRect().left-(0.05*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top+(0.025*this.width)}px` + '; position: fixed; z-index: 999; '+ `${(m.step === i)?"font-size: 1.4rem; color: blue":"font-size: 1.1rem; color: black"}`+   '');
                    }
                    newDiv.appendChild(newContent);
                    newDiv.id = "bubble-step"+i.toString();

                }
                // (m.step === i)?('font-size: 1.3rem; color: blue'):('font-size: 1.3rem; color: black');
                document.getElementById("map-container").appendChild(newDiv);
                const circleType = new CircleType(document.getElementById("bubble-step"+i.toString()));
                // circleType.forceWidth(true);
                this.cities.push(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name);
                console.log(this.cities);
            }
        }
        // }
    }

    getSound() { return this.sound; }

    /**
     * MapWidget's domElem.
     *
     * @returns {JQuery Object} MapWidget's domElem.
     */
    get domElem() { return this._domElem; }

    /**
     * Call after a TUIOTouch creation.
     *
     * @method onTouchCreation
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
    onTouchCreation(tuioTouch) {
        super.onTouchCreation(tuioTouch);
        console.log(tuioTouch);
        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {

            // console.log("touched");
            // if (tuioTouch._id === 'A9')
            // {
            //     console.log("pion mute");
            //     this.socket.emit("sound", {gameRoom: this.gameRoom});
            // }

            this._lastTouchesValues = {
                ...this._lastTouchesValues,
                [tuioTouch.id]: {
                    x: tuioTouch.x,
                    y: tuioTouch.y,
                },
            };
        }
    }

    /**
     * Call after a TUIOTouch update.
     *
     * @method onTouchUpdate
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
    onTouchUpdate(tuioTouch) {
        if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
            /* const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
             const diffX = tuioTouch.x - lastTouchValue.x;
             const diffY = tuioTouch.y - lastTouchValue.y;

             let newX = this.x + diffX;
             let newY = this.y + diffY;

             if (newX < 0) {
             newX = 0;
             }

             if (newX > (WINDOW_WIDTH - this.width)) {
             newX = WINDOW_WIDTH - this.width;
             }

             if (newY < 0) {
             newY = 0;
             }

             if (newY > (WINDOW_HEIGHT - this.height)) {
             newY = WINDOW_HEIGHT - this.height;
             }

             this.moveTo(newX, newY);
             this._lastTouchesValues = {
             ...this._lastTouchesValues,
             [tuioTouch.id]: {
             x: tuioTouch.x,
             y: tuioTouch.y,
             },
             }; */
        }
    }

    /**
     * Call after a TUIOTag creation.
     *
     * @method onTagCreation
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagCreation(tuioTag) {
        super.onTagCreation(tuioTag);
        // console.log('On creation Tag');
        // console.log(tuioTag);
        // console.log(this.isTouched(tuioTag.x, tuioTag.y));
        //
        // console.log("tuioTag.x >= this._x = " +(tuioTag.x >= this._x)+ "   " + tuioTag.x +">="+this._x);
        // console.log("tuioTag.x <= this._x + this._width = " +(tuioTag.x <= this._x + this._width)+ "   " + tuioTag.x+"<="+ this._x +"+"+ this._width);
        // console.log("tuioTag.y >= this._y  = " +(tuioTag.y >= this._y) + "   " + tuioTag.y +">="+this._y);
        // console.log("tuioTag.y <= this._y + this._height = " +(tuioTag.y <= this._y + this._height)+ "   " + tuioTag.y +"<=" +(this._y ) +"+"+ this._height);
        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            // this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});
            console.log("touched");
            if (tuioTag._id === 'A9')
            {
                console.log("pion mute");
                this.socket.emit("sound", {gameRoom: this.gameRoom});
            }

        }
        //if (tuioTag.x >= this._x && tuioTag.x <= this._x + this._width && tuioTag.y >= this._y && tuioTag.y <= this._y + this._height) {
        // const socket = io.connect('http://localhost:4444');
        // socket.emit('message', tuioTag.x + '  ' + tuioTag.y);
        // socket.emit('map', tuioTag.id);
        // socket.on('map-changed', (m) => {
        //     console.log("map changed");
        //     document.getElementById('map').src = m.img;
        // });


        //}




    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
        // console.log('On Update Tag');
        // console.log(tuioTag);
        // console.log(this.isTouched(tuioTag.x, tuioTag.y));
        //
        // console.log("tuioTag.x >= this._x = " +(tuioTag.x >= this._x)+ "   " + tuioTag.x +">="+this._x);
        // console.log("tuioTag.x <= this._x + this._width = " +(tuioTag.x <= this._x + this._width)+ "   " + tuioTag.x+"<="+ this._x +"+"+ this._width);
        // console.log("tuioTag.y >= this._y  = " +(tuioTag.y >= this._y) + "   " + tuioTag.y +">="+this._y);
        // console.log("tuioTag.y <= this._y + this._height = " +(tuioTag.y <= this._y + this._height)+ "   " + tuioTag.y +"<=" +(this._y ) +"+"+ this._height);
        if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {


            const lastTagValue = this._lastTagsValues[tuioTag.id];
            const diffX = tuioTag.x - lastTagValue.x;
            const diffY = tuioTag.y - lastTagValue.y;

            let newX = this.x + diffX;
            let newY = this.y + diffY;

            if (newX < 0) {
                newX = 0;
            }

            if (newX > (WINDOW_WIDTH - this.width)) {
                newX = WINDOW_WIDTH - this.width;
            }

            if (newY < 0) {
                newY = 0;
            }

            if (newY > (WINDOW_HEIGHT - this.height)) {
                newY = WINDOW_HEIGHT - this.height;
            }

            // this.moveTo(newX, newY, radToDeg(tuioTag.angle));
            this._lastTagsValues = {
                ...this._lastTagsValues,
                [tuioTag.id]: {
                    x: tuioTag.x,
                    y: tuioTag.y,
                },
            };
            // this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});

            // const socket = io.connect('http://localhost:4444');
            // socket.emit('message', 'update '+tuioTag.x + '  ' + tuioTag.y);
            // socket.emit('map', tuioTag.id);
            // socket.on('map-changed', (m) => {
            //     document.getElementById('map').src = m.img;
            // });
        }

        // if (this.isTouched(tuioTag.x, tuioTag.y)) {
        //     this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});
        // }




    }

    // onTagDeletion(tuioTag){
    //     this.map.arc([]);
    // }

    /**
     * Move MapWidget.
     *
     * @method moveTo
     * @param {string/number} x - New MapWidget's abscissa.
     * @param {string/number} y - New MapWidget's ordinate.
     * @param {number} angle - New MapWidget's angle.
     */
    moveTo(x, y, angle = null) {
        this._x = x;
        this._y = y;
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        if (angle !== null) {
            this._domElem.css('transform', `rotate(${angle}deg)`);
        }
    }
}

export default MapWidget;

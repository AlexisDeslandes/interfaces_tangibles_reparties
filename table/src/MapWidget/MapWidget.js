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
        // alert(x +' '+ y +' '+ width + ' ' + height);

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
        this.map.bubbles(tmp.concat(m), {
            popupOnHover: true,
            popupTemplate: function () {
                return '<div class="hoverinfo">Hello';
            }
        });
        if(!this.labelsInit){
            let tab = d3.selectAll('.datamaps-bubble')[0];
            console.log("tab = ");
            console.log(tab);
            console.log(tab[0]);
            //
            // var newDiv = document.createElement("div");
            // var newContent = document.createTextNode("Hi there and greetings!");
            // newDiv.id = "ouh";
            // // newDiv.style = ('z-index: 10010; background-color: red');
            // newDiv.style = ('left: ' + `${tab[0].getBoundingClientRect().left}px` + '; top: ' + `${tab[0].getBoundingClientRect().top}px` + '; position: fixed; z-index: 10010; background-color: red');
            //
            // newDiv.appendChild(newContent);
            // document.getElementById("map-container").appendChild(newDiv);
            for (let i = 0; i < tab.length; i++) {
                if(this.cities.indexOf(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name) === -1){
                    console.log("test");
                    console.log(tab[i]);
                    console.log(tab[i].getBoundingClientRect());
                    var newDiv = document.createElement("div");
                    if(i===0 || i=== tab.length-1) {
                        let test = document.createElement('div');
                        if (i === 0) {
                            test.innerHTML = '<div class="row" style="margin: 0;"> <div class="column" style="background-color: #f4f4f4"><img src="res/flag-checkered.svg" style="height: 40px; width: 40px"></div><div class="column" style="background-color: #e4e4e4"><p style="font-size: 1.25rem; font-weight: 900">Alger</p></div></div>';
                            test.style = ('left: ' + `${tab[i].getBoundingClientRect().left-(0.05*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.075*this.width)}px` + '; position: fixed; z-index: 10050;');

                        }else{
                            test.innerHTML = '<div class="row" style="margin: 0;"> <div class="column" style="background-color: #f4f4f4"><img src="res/flag-checkered.svg" style="height: 40px; width: 40px"></div><div class="column" style="background-color: #e4e4e4"><p style="font-size: 1.25rem; font-weight: 900">Tombouctou</p></div></div>';
                            test.style = ('left: ' + `${tab[i].getBoundingClientRect().left-(0.2*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.01*this.height)}px` + '; position: fixed; z-index: 10050;');

                        }
                        // test.innerHTML = '<div class="br3 br--left bg-white pa3 flex flex-column items-center justify-center pink5"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flag-checkered" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-flag-checkered fa-w-16 fa-3x"><path fill="currentColor" d="M243.2 189.9V258c26.1 5.9 49.3 15.6 73.6 22.3v-68.2c-26-5.8-49.4-15.5-73.6-22.2zm223.3-123c-34.3 15.9-76.5 31.9-117 31.9C296 98.8 251.7 64 184.3 64c-25 0-47.3 4.4-68 12 2.8-7.3 4.1-15.2 3.6-23.6C118.1 24 94.8 1.2 66.3 0 34.3-1.3 8 24.3 8 56c0 19 9.5 35.8 24 45.9V488c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24v-94.4c28.3-12.1 63.6-22.1 114.4-22.1 53.6 0 97.8 34.8 165.2 34.8 48.2 0 86.7-16.3 122.5-40.9 8.7-6 13.8-15.8 13.8-26.4V95.9c.1-23.3-24.2-38.8-45.4-29zM169.6 325.5c-25.8 2.7-50 8.2-73.6 16.6v-70.5c26.2-9.3 47.5-15 73.6-17.4zM464 191c-23.6 9.8-46.3 19.5-73.6 23.9V286c24.8-3.4 51.4-11.8 73.6-26v70.5c-25.1 16.1-48.5 24.7-73.6 27.1V286c-27 3.7-47.9 1.5-73.6-5.6v67.4c-23.9-7.4-47.3-16.7-73.6-21.3V258c-19.7-4.4-40.8-6.8-73.6-3.8v-70c-22.4 3.1-44.6 10.2-73.6 20.9v-70.5c33.2-12.2 50.1-19.8 73.6-22v71.6c27-3.7 48.4-1.3 73.6 5.7v-67.4c23.7 7.4 47.2 16.7 73.6 21.3v68.4c23.7 5.3 47.6 6.9 73.6 2.7V143c27-4.8 52.3-13.6 73.6-22.5z" class=""></path></svg></div> <div class="br3 br--right pa3 flex flex-column justify-center bg-white-90 black-70"><p class="mv0 lh-copy f4 fw6">Im afraid I cant flag-checkered that Dave. <span class="link pink5 underline">Retry?</span></p></div>');
                        // this._domElem.attr('src', src);
                        // this._domElem.css('width', `${this.width}px`);
                        // this._domElem.css('height', `${this.height}px`);
                        // this._domElem.css('position', 'absolute');
                        // this._domElem.css('z-index', `${this.zIndex}`);
                        // this._domElem.css('left', `${x}px`);
                        // this._domElem.css('top', `${y}px`);
                        // this._domElem.css('transform', `rotate(${initialRotation}deg)`);
                        // this._domElem.css('transform-origin', `scale(${initialScale})`);
                        // var newStartContent = document.createElement("div");
                        newDiv.id = "extremum";
                        test.className = "hoverinfo";
                        // test.style = ('left: ' + `${tab[i].getBoundingClientRect().left}px` + '; top: ' + `${tab[i].getBoundingClientRect().top}px` + '; position: fixed; z-index: 10050;');
                        // <div class="br3 br--left bg-white pa3 flex flex-column items-center justify-center pink5"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flag-checkered" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-flag-checkered fa-w-16 fa-3x"><path fill="currentColor" d="M243.2 189.9V258c26.1 5.9 49.3 15.6 73.6 22.3v-68.2c-26-5.8-49.4-15.5-73.6-22.2zm223.3-123c-34.3 15.9-76.5 31.9-117 31.9C296 98.8 251.7 64 184.3 64c-25 0-47.3 4.4-68 12 2.8-7.3 4.1-15.2 3.6-23.6C118.1 24 94.8 1.2 66.3 0 34.3-1.3 8 24.3 8 56c0 19 9.5 35.8 24 45.9V488c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24v-94.4c28.3-12.1 63.6-22.1 114.4-22.1 53.6 0 97.8 34.8 165.2 34.8 48.2 0 86.7-16.3 122.5-40.9 8.7-6 13.8-15.8 13.8-26.4V95.9c.1-23.3-24.2-38.8-45.4-29zM169.6 325.5c-25.8 2.7-50 8.2-73.6 16.6v-70.5c26.2-9.3 47.5-15 73.6-17.4zM464 191c-23.6 9.8-46.3 19.5-73.6 23.9V286c24.8-3.4 51.4-11.8 73.6-26v70.5c-25.1 16.1-48.5 24.7-73.6 27.1V286c-27 3.7-47.9 1.5-73.6-5.6v67.4c-23.9-7.4-47.3-16.7-73.6-21.3V258c-19.7-4.4-40.8-6.8-73.6-3.8v-70c-22.4 3.1-44.6 10.2-73.6 20.9v-70.5c33.2-12.2 50.1-19.8 73.6-22v71.6c27-3.7 48.4-1.3 73.6 5.7v-67.4c23.7 7.4 47.2 16.7 73.6 21.3v68.4c23.7 5.3 47.6 6.9 73.6 2.7V143c27-4.8 52.3-13.6 73.6-22.5z" class=""></path></svg></div> <div class="br3 br--right pa3 flex flex-column justify-center bg-white-90 black-70"><p class="mv0 lh-copy f4 fw6">I'm afraid I can't flag-checkered that, Dave. <span class="link pink5 underline">Retry?</span></p></div>
                        // <div class="flex flex-row flex-nowrap items-stretch shadow-3 br3"><div class="br3 br--left bg-white pa3 flex flex-column items-center justify-center pink5"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flag-checkered" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-flag-checkered fa-w-16 fa-3x"><path fill="currentColor" d="M243.2 189.9V258c26.1 5.9 49.3 15.6 73.6 22.3v-68.2c-26-5.8-49.4-15.5-73.6-22.2zm223.3-123c-34.3 15.9-76.5 31.9-117 31.9C296 98.8 251.7 64 184.3 64c-25 0-47.3 4.4-68 12 2.8-7.3 4.1-15.2 3.6-23.6C118.1 24 94.8 1.2 66.3 0 34.3-1.3 8 24.3 8 56c0 19 9.5 35.8 24 45.9V488c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24v-94.4c28.3-12.1 63.6-22.1 114.4-22.1 53.6 0 97.8 34.8 165.2 34.8 48.2 0 86.7-16.3 122.5-40.9 8.7-6 13.8-15.8 13.8-26.4V95.9c.1-23.3-24.2-38.8-45.4-29zM169.6 325.5c-25.8 2.7-50 8.2-73.6 16.6v-70.5c26.2-9.3 47.5-15 73.6-17.4zM464 191c-23.6 9.8-46.3 19.5-73.6 23.9V286c24.8-3.4 51.4-11.8 73.6-26v70.5c-25.1 16.1-48.5 24.7-73.6 27.1V286c-27 3.7-47.9 1.5-73.6-5.6v67.4c-23.9-7.4-47.3-16.7-73.6-21.3V258c-19.7-4.4-40.8-6.8-73.6-3.8v-70c-22.4 3.1-44.6 10.2-73.6 20.9v-70.5c33.2-12.2 50.1-19.8 73.6-22v71.6c27-3.7 48.4-1.3 73.6 5.7v-67.4c23.7 7.4 47.2 16.7 73.6 21.3v68.4c23.7 5.3 47.6 6.9 73.6 2.7V143c27-4.8 52.3-13.6 73.6-22.5z" class=""></path></svg></div> <div class="br3 br--right pa3 flex flex-column justify-center bg-white-90 black-70"><p class="mv0 lh-copy f4 fw6">I'm afraid I can't flag-checkered that, Dave. <span class="link pink5 underline">Retry?</span></p></div></div>
                        //     document.getElementById("map-container").appendChild(test);
                        newDiv.appendChild(test);
                    }
                    else{
                        var newContent = document.createTextNode(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name);
                        newDiv.id = "bubble-step";
                        newDiv.className = "hoverinfo";
                        newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.02*this.width):tab[i].getBoundingClientRect().left-(0.06*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top - 5}px` + '; position: fixed; z-index: 10010;');
                        if(i===1){
                            newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.05*this.width):tab[i].getBoundingClientRect().left-(0.05*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top-(0.015*this.width)}px` + '; position: fixed; z-index: 10010;');
                        }else if(i===3){
                            newDiv.style = ('left: ' + `${i%2===0?tab[i].getBoundingClientRect().left+(0.05*this.width):tab[i].getBoundingClientRect().left-(0.05*this.width)}px` + '; top: ' + `${tab[i].getBoundingClientRect().top+(0.02*this.width)}px` + '; position: fixed; z-index: 10010;');
                        }
                        // newDiv.style = ('left: ' + tab[i].getBoundingClientRect().left + '; top: ' + tab[i].getBoundingClientRect().top + '; position: absolute; z-index: 10010; background-color: red');

                        /*   let elem = $('<p id="map-container">OUHOUH</p>')
                         .css('left', tab[i].getBoundingClientRect().left)
                         .css('top', tab[i].getBoundingClientRect().top)
                         .css('position', 'absolute')
                         .css('border', '5px')
                         .css('background-color', '#f4f4f4'); */

                        newDiv.appendChild(newContent);
                    }
                    document.getElementById("map-container").appendChild(newDiv);
                    this.cities.push(JSON.parse(d3.selectAll('.datamaps-bubble')[0][i].attributes[4].value).name);
                    console.log(this.cities);
                    // document.getElementById("trophies").appendChild(newDiv);
                }

            }
        }
    }

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
// onTouchCreation(tuioTouch) {
//     super.onTouchCreation(tuioTouch);
//     if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
//         this._lastTouchesValues = {
//             ...this._lastTouchesValues,
//             [tuioTouch.id]: {
//                 x: tuioTouch.x,
//                 y: tuioTouch.y,
//             },
//         };
//     }
// }

    /**
     * Call after a TUIOTouch update.
     *
     * @method onTouchUpdate
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
// onTouchUpdate(tuioTouch) {
//     if (typeof (this._lastTouchesValues[tuioTouch.id]) !== 'undefined') {
//         /* const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
//          const diffX = tuioTouch.x - lastTouchValue.x;
//          const diffY = tuioTouch.y - lastTouchValue.y;
//
//          let newX = this.x + diffX;
//          let newY = this.y + diffY;
//
//          if (newX < 0) {
//          newX = 0;
//          }
//
//          if (newX > (WINDOW_WIDTH - this.width)) {
//          newX = WINDOW_WIDTH - this.width;
//          }
//
//          if (newY < 0) {
//          newY = 0;
//          }
//
//          if (newY > (WINDOW_HEIGHT - this.height)) {
//          newY = WINDOW_HEIGHT - this.height;
//          }
//
//          this.moveTo(newX, newY);
//          this._lastTouchesValues = {
//          ...this._lastTouchesValues,
//          [tuioTouch.id]: {
//          x: tuioTouch.x,
//          y: tuioTouch.y,
//          },
//          }; */
//     }
// }

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
            this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});
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
        console.log('On Update Tag');
        console.log(tuioTag);
        console.log(this.isTouched(tuioTag.x, tuioTag.y));

        console.log("tuioTag.x >= this._x = " +(tuioTag.x >= this._x)+ "   " + tuioTag.x +">="+this._x);
        console.log("tuioTag.x <= this._x + this._width = " +(tuioTag.x <= this._x + this._width)+ "   " + tuioTag.x+"<="+ this._x +"+"+ this._width);
        console.log("tuioTag.y >= this._y  = " +(tuioTag.y >= this._y) + "   " + tuioTag.y +">="+this._y);
        console.log("tuioTag.y <= this._y + this._height = " +(tuioTag.y <= this._y + this._height)+ "   " + tuioTag.y +"<=" +(this._y ) +"+"+ this._height);
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
            this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});

            // const socket = io.connect('http://localhost:4444');
            // socket.emit('message', 'update '+tuioTag.x + '  ' + tuioTag.y);
            // socket.emit('map', tuioTag.id);
            // socket.on('map-changed', (m) => {
            //     document.getElementById('map').src = m.img;
            // });
        }

        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            this.socket.emit('map', {id: tuioTag.id, gameRoom: this.gameRoom});
        }




    }

    onTagDeletion(tuioTag){
        this.map.arc([]);
    }

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

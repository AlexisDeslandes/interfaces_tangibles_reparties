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
 * Main class to manage StartButtonWidget.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class StartButtonWidget
 * @extends TUIOWidget
 */
class StartButtonWidget extends TUIOWidget {
    /**
     * StartButtonWidget constructor.
     *
     * @constructor
     * @param {number} x - StartButtonWidget's upperleft coin abscissa.
     * @param {number} y - StartButtonWidget's upperleft coin ordinate.
     * @param {number} width - StartButtonWidget's width.
     * @param {number} height - StartButtonWidget's height.
     */
    constructor(x, y, width, height, socket) {
        // alert(x +' '+ y +' '+ width + ' ' + height);

        super(x, y, width, height);
        this.hasStarted = false;
        this.socket = socket;
        this._lastTouchesValues = {};
        this._lastTagsValues = {};
        let elem = $('<div id="start-widget"></div>')
            .css('width', width)
            .css('height', height)
            .css('position', 'absolute')
            .css('border', '5px')
            .css('left', `${x}px`)
            .css('top', `${y}px`);
        // elem.append($('<img>')
        //     .attr('src', 'res/map_init.png')
        //     .attr('id', 'map')
        //     .css('width', `100%`)
        //     .css('height', `100%`)
        //     .css('visibility', `hidden`)
        //     .css('position', 'absolute'));



        this._domElem = elem;
        console.log(x +' '+ y +' '+ width + ' ' + height);
    }


    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }



    /**
     * StartButtonWidget's domElem.
     *
     * @returns {JQuery Object} StartButtonWidget's domElem.
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
        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this._lastTouchesValues = {
                ...this._lastTouchesValues,
                [tuioTouch.id]: {
                    x: tuioTouch.x,
                    y: tuioTouch.y,
                },
            };
            this.start();
            console.log(tuioTouch.x +"    " +tuioTouch.y);
        }


    }

    start() {
        console.log("toInit sent");
        if(!this.hasStarted) {
            this.hasStarted = true;
            this.socket.emit('init', {});
        }
        // this.socket.on('init', data => {
        //     if(!this.hasStarted){
        //         this.hasStarted = true;
        //         this.gameRoom = data.room;
        //         let index = this.gameRoom.indexOf("room");
        //         var roomId = this.gameRoom.substr(index + 1);
        //         for (let i = 1; i < 5; i++) {
        //             let code = this.gameRoom.substring(4) + "-" + i;
        //             $('#code-list').append("<b id='code_" + i + "'>" + code + "</b><img class='qr_code' id='qr_" + i + "' src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + code + "'/>")
        //         }
        //
        //         $("#start-btn").remove();
        //         this._domElem.remove();
        //         $("#connect").show();
        //     }
        // });

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

    /**
     * Move StartButtonWidget.
     *
     * @method moveTo
     * @param {string/number} x - New StartButtonWidget's abscissa.
     * @param {string/number} y - New StartButtonWidget's ordinate.
     * @param {number} angle - New StartButtonWidget's angle.
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

export default StartButtonWidget;

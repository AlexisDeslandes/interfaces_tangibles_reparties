/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
 import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
 import { radToDeg } from 'tuiomanager/core/helpers';

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
    constructor(x, y, width, height) {
        // alert(x +' '+ y +' '+ width + ' ' + height);

        super(x, y, width, height);

        this._lastTouchesValues = {};
        this._lastTagsValues = {};
        let elem = $('<div id="map-container" ></div>')
            .css('width', width)
            .css('height', height)
            .css('position', 'relative')
            .css('border', '5px')
            .css('background-color', '#f4f4f4');


        // this._domElem = $('<div id="map-container" ></div> </br>');
        // this._domElem.css('width', `inherit`);
        // this._domElem.css('height', `100%`);
        // this._domElem.css('position', 'relative');
        // // this._domElem.css('left', `${x}px`);
        // // this._domElem.css('top', `${y}px`);
        // this._domElem.css('background-color', '#f4f4f4');

        elem.append($('<img>')
            .attr('src', 'https://tse1.mm.bing.net/th?id=OIP.Cu2gKN_R48BSE862JgRIVgHaEb&pid=Api')
            .attr('id', 'map')
            .css('width', `100%`)
            .css('height', `100%`)
            .css('position', 'absolute'));
        this._domElem = elem;

    }


    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
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
        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            this._lastTagsValues = {
                ...this._lastTagsValues,
                [tuioTag.id]: {
                    x: tuioTag.x,
                    y: tuioTag.y,
                },
            };

        }
        //if (tuioTag.x >= this._x && tuioTag.x <= this._x + this._width && tuioTag.y >= this._y && tuioTag.y <= this._y + this._height) {


            const socket = io.connect('http://localhost:4444');
            socket.emit('message', tuioTag.x + '  ' + tuioTag.y);
            socket.emit('map', tuioTag.id);
            socket.on('map-changed', (m) => {
                document.getElementById('map').src = m.img;
            });
        //}




    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
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
            const socket = io.connect('http://localhost:4444');
            socket.emit('message', 'update '+tuioTag.x + '  ' + tuioTag.y);
            socket.emit('map', tuioTag.id);
            socket.on('map-changed', (m) => {
                document.getElementById('map').src = m.img;
            });
        }






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

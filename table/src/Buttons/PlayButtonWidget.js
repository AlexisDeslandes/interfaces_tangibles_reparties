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
 * Main class to manage PlayButtonWidget.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class PlayButtonWidget
 * @extends TUIOWidget
 */
class PlayButtonWidget extends TUIOWidget {
    /**
     * PlayButtonWidget constructor.
     *
     * @constructor
     * @param {number} x - PlayButtonWidget's upperleft coin abscissa.
     * @param {number} y - PlayButtonWidget's upperleft coin ordinate.
     * @param {number} width - PlayButtonWidget's width.
     * @param {number} height - PlayButtonWidget's height.
     */
    constructor(x, y, width, height, socket, gameRoom) {

        super(910, 490, 100, 100);
        this.socket = socket;
        this._lastTouchesValues = {};
        this._lastTagsValues = {};
        this.gameRoom = gameRoom;
        let elem = $('<div id="play-widget"></div>')
            .css('width', '100px')
            .css('height', '100px')
            .css('position', 'absolute')
            .css('border', '5px')
            .css('left', `910px`)
            // .css('z-index', `1000`)
            .css('top', `490px`);
        // elem.append($('<img>')
        //     .attr('src', 'res/map_init.png')
        //     .attr('id', 'map')
        //     .css('width', `100%`)
        //     .css('height', `100%`)
        //     .css('visibility', `hidden`)
        //     .css('position', 'absolute'));



        this._domElem = elem;
        // console.log("PlayWidgetCreated");
        // console.log(x +' '+ y +' '+ width + ' ' + height);
    }


    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }



    /**
     * PlayButtonWidget's domElem.
     *
     * @returns {JQuery Object} PlayButtonWidget's domElem.
     */
    get domElem() { return this._domElem; }

    /**
     * Call after a TUIOTouch creation.
     *
     * @method onTouchCreation
     * @param {TUIOTouch} tuioTouch - A TUIOTouch instance.
     */
    onTouchCreation(tuioTouch) {
        // console.log("Playbuttons");

        super.onTouchCreation(tuioTouch);
        // console.log(this.isTouched(tuioTouch.x, tuioTouch.y));
        if (this.isTouched(tuioTouch.x, tuioTouch.y)) {
            this._lastTouchesValues = {
                ...this._lastTouchesValues,
                [tuioTouch.id]: {
                    x: tuioTouch.x,
                    y: tuioTouch.y,
                },
            };
            this.ready();
            // console.log(tuioTouch.x +"    " +tuioTouch.y);
        }


    }

    ready() {
        this.socket.emit('table-ready', {room: this.gameRoom})
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

    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
     }

    /**
     * Move PlayButtonWidget.
     *
     * @method moveTo
     * @param {string/number} x - New PlayButtonWidget's abscissa.
     * @param {string/number} y - New PlayButtonWidget's ordinate.
     * @param {number} angle - New PlayButtonWidget's angle.
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

export default PlayButtonWidget;

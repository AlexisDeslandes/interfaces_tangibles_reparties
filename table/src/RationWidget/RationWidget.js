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
 * @class RationWidget
 * @extends TUIOWidget
 */
class RationWidget extends TUIOWidget {
    /**
     * RationWidget constructor.
     *
     * @constructor
     * @param {number} x - RationWidget's upperleft coin abscissa.
     * @param {number} y - RationWidget's upperleft coin ordinate.
     * @param {number} width - RationWidget's width.
     * @param {number} height - RationWidget's height.
     */
    constructor(id, player, gameRoom, x, y, width, height, socket) {
        super(x, y, width, height);

        this.idWidget = id;
        this.gameRoom = gameRoom;
        this.player = player;
        this.socket = socket;
        this._lastTouchesValues = {};
        this._lastTagsValues = {};

        this._domElem = $('<div></div>');
        this._domElem.attr('id', id);
        this._domElem.css('width', `${width}px`);
        this._domElem.css('height', `${height}px`);
        this._domElem.css('position', 'absolute');

        console.log(this.idWidget);
        console.log( "x= "+ this._x+ "  y= "+this._y+ " width = "+this._width+" height = "+ this._height);
    }


    /**
     * RationWidget's domElem.
     *
     * @returns {JQuery Object} RationWidget's domElem.
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
        console.log(tuioTag);
        console.log(this.player);
        console.log(this.isTouched(tuioTag.x, tuioTag.y));

        console.log("tuioTag.x >= this._x = " +(tuioTag.x >= this._x)+ "   " + tuioTag.x +">="+this._x);
        console.log("tuioTag.x <= this._x + this._width = " +(tuioTag.x <= this._x + this._width)+ "   " + tuioTag.x+"<="+ this._x +"+"+ this._width);
        console.log("tuioTag.y >= this._y  = " +(tuioTag.y >= this._y) + "   " + tuioTag.y +">="+this._y);
        console.log("tuioTag.y <= this._y + this._height = " +(tuioTag.y <= this._y + this._height)+ "   " + tuioTag.y +"<=" +(this._y ) +"+"+ this._height);


        // socket.emit('isTouched', {tag_x: tuioTag.x, tag_y:tuioTag.y, x: this._x, y: this._y, _width: this._width, _height: this._height});

        if (this.isTouched(tuioTag.x, tuioTag.y)) {
            this.socket.emit('ration', {id: tuioTag.id, player: this.player, gameRoom: this.gameRoom});


            this.socket.on('ration-used', (m) => {
                console.log(m);
                // document.getElementById(m.id).height = '120';
            });
            // socket.emit('isTouched', {tag_x: tuioTag.x, tag_y:tuioTag.y, x: this._x, y: this._y, _width: this._width, _height: this._height});
        }

    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */

    onTagUpdate(tuioTag) {
        console.log(tuioTag);
        console.log(this.player);
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



            // socket.emit('isTouched', {tag_x: tuioTag.x, tag_y:tuioTag.y, x: this._x, y: this._y, _width: this._width, _height: this._height});
        }
        // socket.emit('isTouched', {tag_x: tuioTag.x, tag_y:tuioTag.y, x: this._x, y: this._y, _width: this._width, _height: this._height});
        if (this.isTouched(tuioTag.x, tuioTag.y)) {

            // const socket = io.connect('http://localhost:4444');

        }
    }
    //
    // onTagDeletion(tuioTag) {
    //
    //     const socket = io.connect('http://localhost:4444');
    //     socket.emit('ration', tuioTag.id);
    //     socket.on('ration-used', (m) => {
    //         document.getElementById(m.id).height = '30';
    //
    //     });
    //     super.onTagCreation(tuioTag.id);
    //
    // }

    /**
     * Move RationWidget.
     *
     * @method moveTo
     * @param {string/number} x - New RationWidget's abscissa.
     * @param {string/number} y - New RationWidget's ordinate.
     * @param {number} angle - New RationWidget's angle.
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

export default RationWidget;

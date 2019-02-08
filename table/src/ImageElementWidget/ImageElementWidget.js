/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


// Import JQuery
import $ from 'jquery/dist/jquery.min';
import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';


/**
 * Main class to manage ImageElementWidget.
 *
 * @class ImageElementWidget
 * @extends ElementWidget
 */
class ImageElementWidget extends ElementWidget {
    /**
     * ImageElementWidget constructor.
     *
     * @constructor
     * @param {number} x - ImageElementWidget's upperleft coin abscissa.
     * @param {number} y - ImageElementWidget's upperleft coin ordinate.
     * @param {number} width - ImageElementWidget's width.
     * @param {number} height - ImageElementWidget's height.
     * @param {number} initialRotation - Initial rotation. Set to 0 of no rotation
     * @param {number} initialScale - Initial scale. Set to 1 of no rescale
     * @param {string} src - Source of the image
     */
    constructor(x, y, width, height, initialRotation, initialScale, src) {
        super(x, y, width, height, initialRotation, initialScale);
        this._lastTouchesValues = {};
        this._lastTagsValues = {};
        this.src = src;
        this._domElem = $('#trophies');
        this._domElem.css('width', `${this.width}px`);
        this._domElem.css('height', `${this.height}px`);
        this._domElem.css('z-index', `500`);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        this._domElem.css('background-color', `#156485`);


        let elem = $('<img>');
        elem.attr('src', src);
        elem.css('width', `${this.width}px`);
        elem.css('height', `${this.height}px`);
        // this._domElem.css('position', 'absolute');
        elem.css('transform', `rotate(${initialRotation}deg)`);
        elem.css('transform-origin', `scale(${initialScale})`);
        this._domElem = elem;

        this.hasDuplicate = false;
    } // constructor

    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }


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
            const lastTouchValue = this._lastTouchesValues[tuioTouch.id];
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
            };
        }
    }


    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
        super.onTagUpdate(tuioTag);
        // if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
        //   if (tuioTag.id === this.tagDuplicate && !this.hasDuplicate) {
        //     const clone = new ImageElementWidget(this.x + 10, this.y + 10, this.width, this.height, this._currentAngle, 1, this.src, this.tagMove, this.tagDelete, this.tagZoom, this.tagDuplicate);
        //     TUIOManager.getInstance().addWidget(clone);
        //     this._domElem.parent().append(clone.domElem);
        //     this.hasDuplicate = true;
        //   }
        // }
    }

    /**
     * Call after a TUIOTag deletion.
     *
     * @method onTagDeletion
     * @param {number/string} tuioTagId - TUIOTag's id to delete.
     */
    onTagDeletion(tuioTagId) {
        super.onTagDeletion(tuioTagId);
        // if (typeof (this._lastTagsValues[tuioTagId]) !== 'undefined') {
        //   if (tuioTagId === this.tagDuplicate) {
        //     this.hasDuplicate = false;
        //   }
        // }
    }
} // class ImageElementWidget

export default ImageElementWidget;

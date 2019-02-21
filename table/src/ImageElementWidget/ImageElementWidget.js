/**
 * @author Kevin Duglue <kevin.duglue@gmail.com>
 * @author Rémy Kaloustian <remy.kaloustian@gmail.com>
 */


import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import TUIOManager from 'tuiomanager/core/TUIOManager';
import ElementWidget from 'tuiomanager/widgets/ElementWidget/ElementWidget';
import { radToDeg } from 'tuiomanager/core/helpers';
import Point from 'tuiomanager/src/utils/Point';

/**
 * Abstract class
 *
 * @class ImageElementWidget
 * @extends TUIOWidget
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
        this.src = src;
        this._domElem = $('<img>');
        this._domElem.attr('src', src);
        this._domElem.css('width', `${this.width}px`);
        this._domElem.css('height', `${this.height}px`);
        this._domElem.css('position', 'absolute');
        this._domElem.css('z-index', `9999999`);
        this._domElem.css('left', `${x}px`);
        this._domElem.css('top', `${y}px`);
        this._domElem.css('transform', `rotate(${initialRotation}deg)`);
        this._domElem.css('transform-origin', `scale(${initialScale})`);
        this.hasDuplicate = false;
    } // constructor

    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }

    /**
     * Call after a TUIOTag update.
     *
     * @method onTagUpdate
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagUpdate(tuioTag) {
        super.onTagUpdate(tuioTag);
        if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
            if (tuioTag.id === this.tagDuplicate && !this.hasDuplicate) {
                const clone = new ImageElementWidget(this.x + 10, this.y + 10, this.width, this.height, this._currentAngle, 1, this.src, this.tagMove, this.tagDelete, this.tagZoom, this.tagDuplicate);
                TUIOManager.getInstance().addWidget(clone);
                this._domElem.parent().append(clone.domElem);
                this.hasDuplicate = true;
            }
        }
    }

    /**
     * Call after a TUIOTag deletion.
     *
     * @method onTagDeletion
     * @param {number/string} tuioTagId - TUIOTag's id to delete.
     */
    onTagDeletion(tuioTagId) {
        super.onTagDeletion(tuioTagId);
        if (typeof (this._lastTagsValues[tuioTagId]) !== 'undefined') {
            if (tuioTagId === this.tagDuplicate) {
                this.hasDuplicate = false;
            }
        }
    }
} // class ImageElementWidget

ImageElementWidget.zIndexGlobal = 0;
export default ImageElementWidget;

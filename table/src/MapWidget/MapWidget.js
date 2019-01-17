/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';
import io from 'socket.io-client/dist/socket.io';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
/* import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import { radToDeg } from 'tuiomanager/core/helpers'; */

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
    super(x, y, width, height);

    this._lastTouchesValues = {};
    this._lastTagsValues = {};

    this._domElem = $('<div id="map-container" > Allez Là </div> </br>');
    this._domElem.css('width', `${width}px`);
    this._domElem.css('height', `${height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
    this._domElem.css('background-color', '#f4f4f4');

    this._domElem = $('<img>');
    this._domElem.attr('src', 'https://tse1.mm.bing.net/th?id=OIP.Cu2gKN_R48BSE862JgRIVgHaEb&pid=Api');
    this._domElem.attr('id', 'map');
    this._domElem.css('width', `${width}px`);
    this._domElem.css('height', `${height}px`);
    this._domElem.css('position', 'absolute');
    this._domElem.css('left', `${x}px`);
    this._domElem.css('top', `${y}px`);
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
    const socket = io.connect('http://localhost:4444');
    socket.emit('map', tuioTag.id);
    socket.on('map-changed', (m) => {
      document.getElementById('map').src = m.img;
    });
  }

  /**
   * Call after a TUIOTag update.
   *
   * @method onTagUpdate
   * @param {TUIOTag} tuioTag - A TUIOTag instance.
   */
  onTagUpdate(tuioTag) {
    if (typeof (this._lastTagsValues[tuioTag.id]) !== 'undefined') {
      /* const lastTagValue = this._lastTagsValues[tuioTag.id];
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
      }; */
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

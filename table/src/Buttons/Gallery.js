/**
 * @author Christian Brel <ch.brel@gmail.com>
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from 'tuiomanager/core/constants';
import ImageElementWidget from "../ImageElementWidget/ImageElementWidget";
import { radToDeg } from 'tuiomanager/core/helpers';
import Glide, { Controls, Breakpoints } from '@glidejs/glide/dist/glide.min.js'
// import ImageWidget from '../ImageWidget/ImageWidget';

/**
 * Main class to manage Gallery.
 *
 * Note:
 * It's dummy implementation juste to give an example
 * about how to use TUIOManager framework.
 *
 * @class Gallery
 * @extends TUIOWidget
 */
class Gallery extends TUIOWidget {
    /**
     * Gallery constructor.
     *
     * @constructor
     * @param {number} x - Gallery's upperleft coin abscissa.
     * @param {number} y - Gallery's upperleft coin ordinate.
     * @param {number} width - Gallery's width.
     * @param {number} height - Gallery's height.
     */
    constructor(x, y, width, height) {

        super(x, y, width, height);
        this._lastTouchesValues = {};
        this._lastTagsValues = {};

        this.trophyW1 = null;
        this.trophyW2 = null;
        this.trophyW3 = null;
        this.trophyW4 = null;
        this.trophyW5 = null;
        this.trophyW6 = null;
        this.trophyW7 = null;

        this.newTrophy = null;
        this.unseenTrophies = 0;
        this.visible =false;
        this.recompensesWidget = [];
        this.recompensesWidget.push(this.trophyW1,this.trophyW2,this.trophyW3,this.trophyW4,this.trophyW5,this.trophyW6,this.trophyW7);
        let elem = $('gallery-img');
        // elem.append($('<img>')
        //     .attr('src', 'res/gallery.png')
        //     .attr('id', 'gallery-img')
        //     .css('width', `100%`)
        //     .css('height', `100%`));
        this._domElem = elem;

        // this.glide = new Glide('#map-container', {
        //     startAt: 0,
        //     perView: 3
        // })
        // this.glide.mount();


        // console.log("Gallery Widget Created");
        // console.log(x +' '+ y +' '+ width + ' ' + height);
    }

    notifyBadge(){
        var newDiv = document.createElement("div");
        newDiv.id = "badge-container";
        newDiv.innerHTML = '<canvas id="badge" width="100" height="100" style="position: fixed;border:1px solid #d3d3d3; z-index: 500"></canvas>';
        newDiv.style = ('position: fixed; width: 100px; height: 100px;  z-index: 3000; left: '+ `${this.x +10}px`+'; top: '+ `${this.y}px` +';');
        document.getElementById("gallery").appendChild(newDiv);
        var c = document.getElementById("badge");
        var context = c.getContext("2d");
        context.beginPath();
        context.fillStyle = "red";
        context.strokeStyle = "black";
        context.font = "900 1rem Roboto";
        context.lineWidth = 10;
        context.arc(80, 20, 20, 0, 2 * Math.PI, false);
        context.fill();
        context.beginPath();
        context.fillStyle = "white";
        context.fillText(`+${this.unseenTrophies}`, 70, 25);
        context.fill();
        c.style = ('position: relative');

    }

    hide(){
        this._domElem.hide();
    }

    show(){
        this._domElem.show();
    }

    addPicture(data){
        // const left = document.getElementById('gallery').getBoundingClientRect().left;
        // const top = document.getElementById('gallery').getBoundingClientRect().top;
        // this.recompensesWidget[data.step] = new ImageWidget(384, 287, 300, 300, data.img, data.step*10);
        this.recompensesWidget[data.step] = new ImageWidget(300, 287, 300, 300, data.step*10, 1, data.img,);
        this.recompensesWidget[data.step].hide();
        // $('trophies').append(this.recompensesWidget[data.step].domElem);
        this.recompensesWidget[data.step].addTo($('#trophies').get(0));
    }
    addImage(data, step){
        // const left = document.getElementById('gallery').getBoundingClientRect().left;
        // const top = document.getElementById('gallery').getBoundingClientRect().top;
        // this.recompensesWidget[data.step] = new ImageWidget(384, 287, 300, 300, data.img, data.step*10);
        // this.recompensesWidget[data.step].hide();
        // $('trophies').append(this.recompensesWidget[data.step].domElem);
        // this.recompensesWidget[data.step].addTo($('#trophies').get(0));
        this.unseenTrophies++;
        this.notifyBadge();
        this.recompensesWidget[step] = data;
    }

    /**
     * Gallery's domElem.
     *
     * @returns {JQuery Object} Gallery's domElem.
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
            if(this.visible){
                for(let i=0; i<this.recompensesWidget.length;i++){
                    if(this.recompensesWidget[i] !== null)
                        this.recompensesWidget[i].hide();
                }
            }
            else{
                for(let i=0; i<this.recompensesWidget.length;i++){
                    if(this.recompensesWidget[i] !== null){
                        this.recompensesWidget[i].show();
                        this.unseenTrophies = 0;
                        if(document.getElementById('badge'))
                        document.getElementById('badge').remove();

                    }
                }
            }
            this.visible=!this.visible;
            // console.log(tuioTouch.x +"    " +tuioTouch.y);
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
        }
    }

    /**
     * Call after a TUIOTag creation.
     *
     * @method onTagCreation
     * @param {TUIOTag} tuioTag - A TUIOTag instance.
     */
    onTagCreation(tuioTag) {




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
     * Move Gallery.
     *
     * @method moveTo
     * @param {string/number} x - New Gallery's abscissa.
     * @param {string/number} y - New Gallery's ordinate.
     * @param {number} angle - New Gallery's angle.
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

export default Gallery;

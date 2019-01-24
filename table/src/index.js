/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';

// Import ImageWidget
import ImageElementWidget from 'tuiomanager/widgets/ElementWidget/ImageElementWidget/ImageElementWidget';
import MapWidget from './MapWidget/MapWidget';
import RationWidget from './RationWidget/RationWidget';
import GameManager from "./GameManager";
/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();


/** App Code **/

const buildApp = () => {
    // const mapWidget = new MapWidget(document.getElementById('app').offsetTop,
    //     document.getElementById('app').offsetTop,
    //     document.getElementById('app').offsetWidth,
    //     document.getElementById('app').offsetHeight);

    const game = new GameManager();

    // $('#app').append(mapWidget.domElem);



};

$(window).ready(() => {
    buildApp();
});

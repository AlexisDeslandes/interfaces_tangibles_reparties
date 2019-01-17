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
import MapWidget from './MapWidget/MapWidget';
import GameManager from "./GameManager";
/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();



/** App Code **/

const buildApp = () => {
    const mapWidget = new MapWidget(450, 250, 950, 483);

    const game = new GameManager(mapWidget);

    $('#app').append(mapWidget.domElem);
};

$(window).ready(() => {
    buildApp();
});

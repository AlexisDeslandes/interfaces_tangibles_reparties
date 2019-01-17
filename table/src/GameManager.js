
import $ from 'jquery/dist/jquery.min';

class GameManager {

    constructor(widget){
        this.widget = widget;
        this.widget.hide();

        let self = this;

        this.connectDiv = $("#connect");
        this.startDiv = $("#start-btn");
        this.mapBtn = $("#fab");

        //this.connectDiv.hide();

        this.startDiv.click(function () {
            self.start();
        });

        this.mapBtn.click(function () {
            self.showAndHideMap();
        });
    }

    start(){
        this.startDiv.remove();
        this.connectDiv.show();
    }

    showAndHideMap(){
        this.widget._domElem.is(":visible") ? this.widget.hide() : this.widget.show();
    }


}



export default GameManager;
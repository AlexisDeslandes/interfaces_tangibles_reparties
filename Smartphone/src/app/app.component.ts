import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from "../pages/home/home";
import {GamePage} from "../pages/game/game";
import {GuidelinePage} from "../pages/guideline/guideline";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    //rootPage:any = GuidelinePage;
    rootPage: any = HomePage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
        platform.ready().then(() => {
            // Okay, so the platform is accessToGuideline and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
}


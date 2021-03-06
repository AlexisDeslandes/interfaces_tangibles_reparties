import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ReadyPageModule} from "../pages/ready/ready.module";
import {ComponentsModule} from "../components/components.module";
import {GamePageModule} from "../pages/game/game.module";
import {GuidelinePageModule} from "../pages/guideline/guideline.module";
import {MoveguidelinePageModule} from "../pages/moveguideline/moveguideline.module";
import {LongPressModule} from "ionic-long-press";
import {SocketManagerProvider} from '../providers/socket-manager/socket-manager';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {DilemmePage} from "../pages/dilemme/dilemme";
import {GamePage} from "../pages/game/game";
import {Guideline2PageModule} from "../pages/guideline2/guideline2.module";
import {SideguidelinePageModule} from "../pages/sideguideline/sideguideline.module";
import {ReadyStepPage} from "../pages/ready-step/ready-step";
import {GameoverPage} from "../pages/gameover/gameover";
import {InventoryPage} from "../pages/inventory/inventory";
import {Guideline3PageModule} from "../pages/guideline3/guideline3.module";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {FinishPage} from "../pages/finish/finish";

// const config: SocketIoConfig = {url: 'http://localhost:4444', options: {}};
const config: SocketIoConfig = {url: 'http://10.188.26.122:4444', options: {}};


@NgModule({
    declarations: [
        MyApp,
        HomePage,
        DilemmePage,
        ReadyStepPage,
        GameoverPage,
        InventoryPage,
        FinishPage
    ],
    imports: [
        SocketIoModule.forRoot(config),
        BrowserModule,
        ReadyPageModule,
        GamePageModule,
        GuidelinePageModule,
        MoveguidelinePageModule,
        Guideline2PageModule,
        Guideline3PageModule,
        SideguidelinePageModule,
        IonicModule.forRoot(MyApp),
        ComponentsModule,
        LongPressModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        DilemmePage,
        GamePage,
        ReadyStepPage,
        GameoverPage,
        InventoryPage,
        FinishPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        SocketManagerProvider,
        BarcodeScanner
    ]
})
export class AppModule {
}

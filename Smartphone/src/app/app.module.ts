import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {ReadyPageModule} from "../pages/ready/ready.module";
import {ComponentsModule} from "../components/components.module";
import {GamePageModule} from "../pages/game/game.module";
import {GuidelinePageModule} from "../pages/guideline/guideline.module";
import {MoveguidelinePageModule} from "../pages/moveguideline/moveguideline.module";
import {LongPressModule} from "ionic-long-press";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    ReadyPageModule,
    GamePageModule,
    GuidelinePageModule,
    MoveguidelinePageModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    LongPressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

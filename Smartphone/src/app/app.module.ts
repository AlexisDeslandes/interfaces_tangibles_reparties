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
import { SocketManagerProvider } from '../providers/socket-manager/socket-manager';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
      SocketIoModule.forRoot(config),
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SocketManagerProvider
  ]
})
export class AppModule {}

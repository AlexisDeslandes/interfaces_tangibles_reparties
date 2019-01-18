import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

import {AppComponent} from './app.component';
import {ExampleSocketComponent} from './pages/example-socket/example-socket.component';
import {GameLauncherComponent} from './pages/games/fast/game-launcher/game-launcher.component';
import { GameManagerComponent } from './pages/games/game-manager/game-manager.component';
import { GameComponent } from './pages/games/fast/game/game.component';
import { TappingComponent } from './pages/games/fast/tapping/tapping.component';
import { AppComponent } from './app.component';
import { ExampleSocketComponent } from './pages/example-socket/example-socket.component';
import { MainContainerComponent } from './pages/main-container/main-container.component';
import { WaitingForStartComponent } from './pages/waiting-for-start/waiting-for-start.component';
import { StartGameComponent } from './pages/start-game/start-game.component';
import {FormsModule} from "@angular/forms";

const config: SocketIoConfig = {url: 'http://localhost:4444', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    ExampleSocketComponent,
    GameLauncherComponent,
    GameManagerComponent,
    GameComponent,
    TappingComponent
    ExampleSocketComponent,
    MainContainerComponent,
    WaitingForStartComponent,
    StartGameComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

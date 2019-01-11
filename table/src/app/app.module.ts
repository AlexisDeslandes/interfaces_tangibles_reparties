import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { ExampleSocketComponent } from './pages/example-socket/example-socket.component';
import { MainContainerComponent } from './pages/main-container/main-container.component';
import { WaitingForStartComponent } from './pages/waiting-for-start/waiting-for-start.component';
import { StepDilemneComponent } from './pages/step-dilemne/step-dilemne.component';
import { StartGameComponent } from './pages/start-game/start-game.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ExampleSocketComponent,
    MainContainerComponent,
    WaitingForStartComponent,
    StepDilemneComponent,
    StartGameComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

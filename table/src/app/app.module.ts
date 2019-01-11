import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ExampleSocketComponent } from './pages/example-socket/example-socket.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleSocketComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

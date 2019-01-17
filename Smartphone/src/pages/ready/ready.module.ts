import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReadyPage} from './ready';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ReadyPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ReadyPage),
  ],
})
export class ReadyPageModule {
}

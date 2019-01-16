import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoveguidelinePage } from './moveguideline';
import {LongPressModule} from "ionic-long-press";

@NgModule({
  declarations: [
    MoveguidelinePage,
  ],
  imports: [
    LongPressModule,
    IonicPageModule.forChild(MoveguidelinePage),
  ]
})
export class MoveguidelinePageModule {}

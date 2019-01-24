import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadyStepPage } from './ready-step';

@NgModule({
  declarations: [
    ReadyStepPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadyStepPage),
  ],
})
export class ReadyStepPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DilemmePage } from './dilemme';

@NgModule({
  declarations: [
    DilemmePage,
  ],
  imports: [
    IonicPageModule.forChild(DilemmePage),
  ],
})
export class DilemmePageModule {}

import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ReadyPage} from "../ready/ready";
import {MoveguidelinePage} from "../moveguideline/moveguideline";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  accessToGuideline(){
    this.navCtrl.push(MoveguidelinePage)
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DilemmePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dilemme',
  templateUrl: 'dilemme.html',
})
export class DilemmePage {

  data;
  hasAnswered = false;
  choice;
  result;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = navParams.get('step');
    console.log('received',this.data)
  }

  answer(){
    this.hasAnswered = true;
    this.result = this.data.choices[this.choice].result;
  }

  next(){

  }

}

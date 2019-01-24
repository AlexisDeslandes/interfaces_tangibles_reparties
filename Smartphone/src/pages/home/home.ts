import { Component,OnInit } from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {ReadyPage} from "../ready/ready";
import {MoveguidelinePage} from "../moveguideline/moveguideline";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs";
import {DilemmePage} from "../dilemme/dilemme";
import {GamePage} from "../game/game";
import {ReadyStepPage} from "../ready-step/ready-step";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  status = "";
  socketSubscription: Subscription;
  code;

  readyToStart = false;

  constructor(public navCtrl: NavController, public socketManager : SocketManagerProvider,
              public toastController: ToastController) {


      this.status = "Connexion au serveur en cours...";

      this.socketSubscription = this.socketManager.stateSubject.subscribe(data => {
          console.log(data)
          if (data['status'] === 'connected') {
              this.status = data['message'];
              this.readyToStart = true;
              this.navCtrl.push(ReadyStepPage);
          } else if (data['status'] === 'start'){
              this.go()              //
          }
      })

  }

  connectWithCode(){
      console.log(this.code);
      if (/([0-9]+-[0-9])/.test(this.code)){
          let t = this.code.split('-');
          this.socketManager.join('game'+t[0],t[1])
      } else {
          this.code = "";
          this.toastController.create({
              message: 'Mauvais code',
              duration: 2000
          }).present();
      }

  }

  go(){
      let data = this.socketManager.state;
      switch(data['step'].type){
          case 'dilemme':
              this.navCtrl.push(DilemmePage,data);
              break;
          case 'minijeu':
              this.navCtrl.push(GamePage, data);
              break;
      }
  }

  accessToGuideline(){
    this.navCtrl.push(MoveguidelinePage)
  }



}

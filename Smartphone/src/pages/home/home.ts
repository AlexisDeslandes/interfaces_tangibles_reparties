import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ReadyPage} from "../ready/ready";
import {MoveguidelinePage} from "../moveguideline/moveguideline";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs";
import {DilemmePage} from "../dilemme/dilemme";
import {GamePage} from "../game/game";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {


  status = "";
  socketSubscription: Subscription;
  code;

  readyToStart = false;

  constructor(public navCtrl: NavController, public socketManager : SocketManagerProvider) {


      this.status = "Connexion au serveur en cours...";

      this.socketSubscription = this.socketManager.stateSubject.subscribe(data => {
          console.log(data)
          if (data['status'] === 'connected') {
              this.status = data['message']
              this.readyToStart = true;
          } else if (data['status'] === 'start'){
              //
          }
      })

  }

  connectWithCode(){
      console.log(this.code)
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

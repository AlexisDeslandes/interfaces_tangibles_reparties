import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ReadyPage} from "../ready/ready";
import {MoveguidelinePage} from "../moveguideline/moveguideline";
import {SocketManagerProvider} from "../../providers/socket-manager/socket-manager";
import {Subscription} from "rxjs";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  status;
  socketSubscription: Subscription;

  constructor(public navCtrl: NavController, public socketManager : SocketManagerProvider) {


      this.status = {message:"Connexion au serveur en cours..."};

      this.socketSubscription = this.socketManager.stateSubject.subscribe(data => {
          this.status = data;
      })

  }

  accessToGuideline(){
    this.navCtrl.push(MoveguidelinePage)
  }



}

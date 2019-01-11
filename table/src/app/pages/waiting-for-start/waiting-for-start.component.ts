import { Component, OnInit } from '@angular/core';
import {SocketManagerService} from "../../services/socket-manager/socket-manager.service";

@Component({
  selector: 'app-waiting-for-start',
  templateUrl: './waiting-for-start.component.html',
  styleUrls: ['./waiting-for-start.component.css']
})
export class WaitingForStartComponent implements OnInit {

  constructor(public socketManager : SocketManagerService) { }

  ngOnInit() {
  }

}

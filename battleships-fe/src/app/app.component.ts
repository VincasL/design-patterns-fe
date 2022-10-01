import { Component, OnInit } from '@angular/core';
import {SignalrService} from "./services/signalr.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private readonly signalRService: SignalrService) {
  }

  ngOnInit(): void {
    this.signalRService.startConnection('http://localhost:5166/api/battleship');
  }
}

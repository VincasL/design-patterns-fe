import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import {SignalrService} from "./services/signalr-service.service";
import {environment} from "../environments/environment";
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private hubConnection?: HubConnection
  constructor( private http: HttpClient) {
  }

  async ngOnInit() {
    await this.startConnection();
    console.log(this.hubConnection);

    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('/api/test').pipe(
      tap(x => console.log(x))
    ).subscribe();
  }

  onButtonClick() {
    this.startHttpRequest();
    console.log(this.hubConnection);
  }

  public startConnection() {
    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:4200/api/battleship").build();

      this.hubConnection.on('sendMessage', () => {
        console.log('message received from BE')
      })

      this.hubConnection.start()
        .then(() => {
          console.log("connection established");
          return resolve(true);
        })
        .catch((err: any) => {
          console.log("error occured" + err);
          reject(err);
        });
    });
  }
}

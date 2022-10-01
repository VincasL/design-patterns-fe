import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { SignalrService } from "./services/signalr-service.service";
import { environment } from "../environments/environment";
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  hubConnection?: HubConnection
  constructor(private http: HttpClient, public signalrService: SignalrService) {
  }

  async ngOnInit() {
    this.startConnection();

    setTimeout(() => {
      this.askServerListener();
      this.askServer();
    }, 2000)
    console.log(this.hubConnection);

    this.startHttpRequest();
  }
  ngOnDestroy() {
    this.hubConnection?.off("askServerResponse");
  }

  private startHttpRequest = () => {
    this.http.get('http://localhost:5001/api/battleship').pipe(
      tap(x => console.log(x))
    ).subscribe();
  }

  onButtonClick() {
    this.startHttpRequest();
    console.log(this.hubConnection);
  }

  startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5001/api/battleship", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      }).build();

    this.hubConnection.on('sendMessage', () => {
      console.log('message received from BE')
    })

    this.hubConnection.start()
      .then(() => {
        console.log("connection established");
      })
      .catch((err: any) => {
        console.log("error occured" + err);
      });
  };
  askServer() {
    this.hubConnection?.invoke("askServer", "somethingElse").catch(err => console.error(err));
  }

  askServerListener() {
    this.hubConnection?.on("askServerResponse", (someText) => {
      console.log(someText);
    })
  }
}

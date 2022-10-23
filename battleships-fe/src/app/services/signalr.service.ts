import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
} from '@microsoft/signalr';

export interface Message {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignalrService {

  hubConnection?: HubConnection;
  constructor(private http: HttpClient) {}

  startConnection = (url: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        timeout: 999999999999
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('connection established');
      })
      .catch((err: any) => {
        console.log('error occured' + err);
      });
  };

  addEventListener(name: string, callbackFn: (...args: any[]) => void) {
    this.hubConnection?.on(name, callbackFn);
  }

  removeEventListener(name: string,) {
    this.hubConnection?.off(name);
  }

  send(name: string, ...args: any[] ) {
    if(args){
      this.hubConnection
        ?.invoke(name, ...args)
        .catch((err) => console.error(err));
    }
    else{
      this.hubConnection
        ?.invoke(name)
        .catch((err) => console.error(err));
    }
  }
}

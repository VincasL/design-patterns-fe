import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

export interface Message{
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('api/battleship')
      .build()

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('boi', (data) => {
      console.log(data);
    });
  }
}

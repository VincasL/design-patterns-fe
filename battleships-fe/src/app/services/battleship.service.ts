import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class BattleshipService {
  private joinQueueSubject: Subject<any> = new Subject();

  constructor(private readonly signalRService: SignalrService) {}

  startGame(name: string): Observable<any> {
    this.signalRService.addEventListener('startGame', (player1, player2) =>
      this.joinQueueSubject.next({player1, player2})
    );

    this.signalRService.emitEvent('joinQueue', name)

    return this.joinQueueSubject.asObservable();
  }
}

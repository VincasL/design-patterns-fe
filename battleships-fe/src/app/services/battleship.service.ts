import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { SignalrService } from './signalr.service';
import { GameData } from '../shared/models';

@Injectable({
  providedIn: 'root',
})
export class BattleshipService {
  private startGameSubject: Subject<void> = new Subject();
  private gameDataSubject: Subject<GameData> = new Subject();

  constructor(private readonly signalRService: SignalrService) {
    this.registerStartGameHandler();
    this.registerGameDataHandler();
  }

  startGame$ = this.startGameSubject.asObservable();
  gameData$ = this.gameDataSubject.asObservable();

  startGame(name: string): Observable<void> {
    this.joinQueue(name);
    return this.startGame$;
  }

  // Sending events
  private joinQueue(name: string) {
    this.signalRService.send('joinQueue', name);
  }

  // Registering event handlers
  private registerStartGameHandler() {
    this.signalRService.addEventListener('startGame', () => {
      this.startGameSubject.next();
    });
  }

  private registerGameDataHandler() {
    this.signalRService.addEventListener('gameData', (gameData) => {
      this.gameDataSubject.next(gameData);
    });
  }

  fetchMockGameData() {
    this.gameDataSubject.next({
      playerOne: { name: 'Stepas' },
      playerTwo: { name: 'Marinis' },
    });
  }
}

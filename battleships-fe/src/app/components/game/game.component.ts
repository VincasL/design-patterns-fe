import { Component, OnInit } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import {GameData, Ship} from '../../shared/models';
import { BattleshipService } from '../../services/battleship.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private readonly battleshipService: BattleshipService) {}

  gameData?: GameData;

  gameData$: Observable<GameData> = this.battleshipService.gameData$.pipe(
    filter(Boolean),
    tap((data) => {
      this.gameData = data;
      sessionStorage.setItem('connectionId', data.playerOne.connectionId);
      console.log(data);
    })
  );

  ngOnInit(): void {
    this.assignNewConnectionIdToPlayerAfterRefresh();
    this.gameData$.subscribe();
  }

  sendShipData() {
    this.battleshipService.saveShips();
  }

  sendMockShipData() {
    this.battleshipService.sendMockShipData();
  }

  setMockSessionData() {
    this.battleshipService.setMockGameSessionData();
  }

  destroyEverything() {
    this.battleshipService.destroyAllShipsAndWinGame();
  }

  private assignNewConnectionIdToPlayerAfterRefresh() {
    const connectionId = sessionStorage.getItem('connectionId');
    console.log(connectionId);
    if(connectionId)
    {
      setTimeout(() => this.battleshipService.assignNewConnectionId(connectionId), 500);
    }
  }
}

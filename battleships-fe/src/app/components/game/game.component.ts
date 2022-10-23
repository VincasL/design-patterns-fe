import { Component, OnInit } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { GameData, Ship } from '../../shared/models';
import { BattleshipService } from '../../services/battleship.service';
import { GameDataObserver } from '../../observer/GameDataObserver';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private readonly battleshipService: BattleshipService) {}

  gameData?: GameData;

  gameDataObserver: GameDataObserver = new GameDataObserver(
    (gameData) =>{
      (this.gameData = gameData);
      sessionStorage.setItem('connectionId', gameData.playerOne.connectionId);
    }
  );

  ngOnInit(): void {
    this.assignNewConnectionIdToPlayerAfterRefresh();
    this.battleshipService.gameData$.subscribe(this.gameDataObserver);
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
    if (connectionId) {
      setTimeout(
        () => this.battleshipService.assignNewConnectionId(connectionId),
        500
      );
    }
  }

  moveRight() {
    this.battleshipService.moveRight({X: 1, Y:1});
  }
}

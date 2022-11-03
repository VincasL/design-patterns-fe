import { Component, OnInit } from '@angular/core';
import { GameData } from '../../shared/models';
import { BattleshipService } from '../../services/battleship.service';
import { GameDataObserver } from '../../observer/GameDataObserver';
import { GameComponentService } from './game.component.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(
    private readonly battleshipService: BattleshipService,
    private readonly gameComponentService: GameComponentService
  ) {}

  gameData?: GameData;
  placingShips = true;

  gameDataObserver: GameDataObserver = new GameDataObserver((gameData) => {
    this.gameData = gameData;
    this.placingShips = !gameData.playerOne.areAllShipsPlaced;
    sessionStorage.setItem('connectionId', gameData.playerOne.connectionId);
  });

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

  sendRandomMoveData() {
    this.battleshipService.makeRandomMoves();
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


}

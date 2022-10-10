import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { GameData } from '../../shared/models';
import { BattleshipService } from '../../services/battleship.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private readonly battleshipService: BattleshipService) {}

  gameData?: GameData;

  gameData$ = this.battleshipService.gameData$.pipe(
    tap((data) => {
      this.gameData = data;
      console.log(data);
    })
  );

  ngOnInit(): void {
    this.gameData$.subscribe();
  }

  requestData(): void {
    this.battleshipService.requestData();
  }

  sendShipData() {
    this.battleshipService.sendShipData();
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
}

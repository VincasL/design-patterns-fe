import { Component, Input, OnInit } from '@angular/core';
import { BattleshipService } from '../../../../services/battleship.service';
import { Board, Cell } from '../../../../shared/models';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @Input() board?: Board;

  constructor(private readonly battleshipService: BattleshipService) {}

  ngOnInit(): void {}

  onCellClick(cell: Cell) {
    if (!this.battleshipService.isShipsPlaced) {
      this.battleshipService.placeShip(cell);
      this.battleshipService.updatePlayerMap(cell);
      this.battleshipService.updateShips(cell);
      const isValid = this.battleshipService.validateShips();

      this.battleshipService.convertShips();
    }
  }
}

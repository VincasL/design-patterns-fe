import { Component, Input, OnInit } from '@angular/core';
import { BattleshipService } from '../../../../services/battleship.service';
import { Board, Cell, CellType } from '../../../../shared/models';

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
    console.log();
    if (cell.type == CellType.Ship) {
      this.destroyShip(cell);
    }

    if (cell.type == CellType.NotShot) {
      cell.type = CellType.EmptyShot;
    }
  }

  destroyShip(cell: Cell) {
    cell.type = CellType.DamagedShip;
    const ship = this.getShipCells(cell);

    if (this.isShipDestroyed(ship)) {
      this.changeAllCellsTypeTo(ship, CellType.DestroyedShip);
    }
  }

  isShipDestroyed(ship: Cell[]) {
    return ship.every((cell) => cell.type === CellType.DamagedShip);
  }

  changeAllCellsTypeTo(cells: Cell[], type: CellType) {
    cells.forEach((cell) => (cell.type = type));
  }

  getShipCells(cell: Cell, ship: Cell[] = []) {
    const cells: Cell[] = ship;
    // console.log(cell);
    const directions = [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { y: -1, x: 0 },
      { y: 1, x: 0 },
    ];

    directions.forEach((direction) => {
      const pos = [cell.x + direction.x, cell.y + direction.y];
      if (!pos.every((pos) => pos > -1 && pos < (this.board?.size || 10)))
        return;
      const newCell = this.board?.cells[pos[0]][pos[1]];

      if (newCell === undefined) return;
      if (cells.includes(newCell)) return;
      if (
        ![CellType.Ship, CellType.DamagedShip].some(
          (type) => type === newCell?.type
        )
      )
        return;
      cells.push(newCell);
      cells.concat(this.getShipCells(newCell, cells));
    });

    return cells;
  }

      this.battleshipService.convertShips();
    }
  }
}

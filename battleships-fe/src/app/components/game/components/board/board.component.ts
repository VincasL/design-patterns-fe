import { Component, Input, OnInit } from '@angular/core';
import {
  Board,
  Cell,
  CellType,
  Ship,
  ShipType,
} from '../../../../shared/models';
import {BattleshipService} from "../../../../services/battleship.service";

const DIAGONAL_DIRECTIONS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 1 },
  { x: -1, y: 1 },
];

const DIRECTIOINS = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  @Input() board?: Board;
  @Input() areShipsPlaced?: boolean;
  private ships: Ship[] = [];
  private shipsCells: Cell[][] = [];

  constructor(private readonly battleshipService: BattleshipService) {}

  ngOnInit(): void {}

  onCellClick(cell: Cell) {
    if (!this.areShipsPlaced) {
      this.placeShip(cell);
      this.updatePlayerMap(cell);
      this.updateShips(cell);

      this.convertShips();
    } else if (!this.areShipsPlaced) {
    }

    // if (cell.type == CellType.Ship) {
    //   this.destroyShip(cell);
    // }

    // if (cell.type == CellType.NotShot) {
    //   cell.type = CellType.EmptyShot;
    // }
  }

  convertShips() {
    this.ships = [];
    this.shipsCells.forEach((ship) => {
      const firstCell = ship[0];
      const type = this.getShipType(ship);
      const isHorizontal = ship.every((cord) => cord.x === firstCell.x);
      const key = isHorizontal ? 'x' : 'y';
      const cell = ship
        .sort((a, b) => (a[key] >= b[key] ? -1 : 1))
        .at(0) as Cell;

      this.ships.push({
        isHorizontal,
        type,
        cell,
      });
    });
    this.battleshipService.ships = this.ships;
  }

  getShipType(ship: Cell[]) {
    const size = ship.length;

    if (size === 5) return ShipType.Carrier;
    if (size === 4) return ShipType.Battleship;
    if (size === 3) return ShipType.Cruiser;
    if (size === 2) return ShipType.Destroyer;
    return ShipType.Destroyer;
  }

  validateShips() {
    const error: { [num: number]: number } = {};
    [4, 3, 2, 1].forEach(
      (length) => (error[length] = this.countShipsByLength(length))
    );

    return error;
  }

  updateShips(lastCell: Cell) {
    const getShipId = (cell: Cell) => {
      for (let id = 0; id < this.shipsCells.length; id++) {
        const ship = this.shipsCells[id];
        const arroundCells = this.getAroundCells(cell.x, cell.y);
        if (ship.includes(cell)) return id;
        if (arroundCells.some((cell) => ship.includes(cell))) return id;
      }
      return undefined;
    };

    const id = getShipId(lastCell);
    if (lastCell.type === CellType.NotShot) {
      this.shipsCells = this.shipsCells
        .map((ship) => ship.filter((cell) => cell !== lastCell))
        .filter((ship) => ship.length > 0);
    } else if (id === undefined) this.shipsCells.push([lastCell]);
    else {
      this.shipsCells[id].push(lastCell);
    }
  }

  updatePlayerMap(lastCell: Cell) {
    const shipCells = this.getShipCells();

    const updateDiagonal = (cell: Cell, type: CellType) => {
      const diagonalCells = this.getDiagonalCells(cell.x, cell.y);
      diagonalCells.forEach((cell) => {
        cell.type = type;
      });
    };
    if (lastCell.type === CellType.NotShot)
      updateDiagonal(lastCell, CellType.NotShot);

    shipCells.forEach((cell) => updateDiagonal(cell, CellType.EmptyShot));
  }

  placeShip(cell: Cell) {
    if (cell.type == CellType.NotShot) {
      cell.type = CellType.Ship;
      return;
    }
    if (cell.type == CellType.Ship) {
      cell.type = CellType.NotShot;
    }
  }

  // --------------------------------------------------------------

  getDiagonalCells(x: number, y: number) {
    const cells = DIAGONAL_DIRECTIONS.map((dir) =>
      this.getCellAt(x + dir.x, y + dir.y)
    );
    return cells.filter((cell) => cell) as Cell[];
  }

  getAroundCells(x: number, y: number) {
    const cells = DIRECTIOINS.map((dir) =>
      this.getCellAt(x + dir.x, y + dir.y)
    );
    return cells.filter((cell) => cell) as Cell[];
  }

  countShipsByLength(length: number) {
    return this.shipsCells.filter((ship) => ship.length === length).length;
  }

  getShipCells() {
    return this.board?.cells
      .flat()
      .filter((cell) => cell.type == CellType.Ship) as Cell[];
  }

  getCellAt(x: number, y: number) {
    if (!this.isValidCell(x, y)) return;
    return this.board?.cells[x][y];
  }

  isValidCell(x: number, y: number) {
    return [x, y].every((cord) => cord > -1 && cord < (this.board?.size || 10));
  }

  getCellType(cell: Cell) {
    switch (cell.type) {
      case CellType.Empty:
        return 'empty';
      case CellType.EmptyShot:
        return 'emptyshot';
      case CellType.DamagedShip:
        return 'damage';
      case CellType.DestroyedShip:
        return 'destroy';
      case CellType.NotShot:
        return 'notshot';
      case CellType.Ship:
        return 'ship';
    }
  }
}

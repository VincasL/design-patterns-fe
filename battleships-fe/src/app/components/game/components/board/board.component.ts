import { Component, Input, OnInit } from '@angular/core';
import { BattleshipService } from '../../../../services/battleship.service';
import {
  Board,
  Cell,
  CellType,
  Ship,
  ShipType,
} from '../../../../shared/models';

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
  @Input() isMyBoard?: boolean = false;
  @Input() isYourMove?: boolean;
  @Input() isGameOver?: boolean = false;
  @Input() winner?: boolean = false;
  private ships: Ship[] = [];
  private shipsCells: Cell[][] = [];

  constructor(private readonly battleshipService: BattleshipService) {}

  ngOnInit(): void {}

  onCellClick(cell: Cell) {
    if (this.isGameOver) return;
    console.log(
      this.areShipsPlaced,
      this.isYourMove,
      this.isGameOver,
      this.board
    );
    if (this.areShipsPlaced === false && this.isMyBoard) {
      this.placeShip(cell);
      this.updatePlayerMap(cell);
      this.updateShips(cell);

      this.convertShips();
    } else if (this.isYourMove && !this.isMyBoard) {
      this.battleshipService.onMoveMade({ X: cell.x, Y: cell.y });
    }
  }

  convertShips() {
    this.ships = [];
    this.shipsCells.forEach((ship, id) => {
      const firstCell = ship[0];
      const type = this.getShipType(ship);
      const isHorizontal = ship.every((cord) => cord.x === firstCell.x);
      const key = isHorizontal ? 'x' : 'y';
      this.shipsCells[id].sort((a, b) =>
        a[key] < b[key] ? 1 : b[key] < a[key] ? -1 : 0
      );

      const cell = ship.at(0) as Cell;

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
      const ids = [];
      for (let id = 0; id < this.shipsCells.length; id++) {
        const ship = this.shipsCells[id];
        const arroundCells = this.getAroundCells(cell.x, cell.y);
        if (ship.includes(cell)) ids.push(id);
        if (arroundCells.some((cell) => ship.includes(cell))) ids.push(id);
      }
      return ids;
    };

    const addShip = () => {
      if (ids.length === 0) {
        this.shipsCells.push([lastCell]);
      } else if (new Set(ids).size === 1) {
        this.shipsCells[ids[0]].push(lastCell);
      } else {
        const joinedShip = [
          ...ids.map((id) => this.shipsCells[id]).flat(),
          lastCell,
        ];

        this.shipsCells = this.shipsCells.filter((_, id) => !ids.includes(id));
        this.shipsCells.push(joinedShip);
      }
    };

    const removeShip = () => {
      if (ids.length === 0) {
        this.shipsCells = this.shipsCells
          .map((ship) => ship.filter((cell) => cell !== lastCell))
          .filter((ship) => ship.length > 0);
      } else {
        const id = ids[0];
        const cellId = this.shipsCells[id].findIndex(
          (cell) => cell === lastCell
        );
        if (cellId < 0) return;
        const ship1 = this.shipsCells[id].slice(0, cellId);
        const ship2 = this.shipsCells[id].slice(cellId + 1);

        if (ship1.length > 0) this.shipsCells[id] = [...ship1];
        if (ship2.length > 0) this.shipsCells.push(ship2);
      }
    };

    let ids = getShipId(lastCell);
    if (lastCell.type === CellType.Ship) addShip();
    if (lastCell.type === CellType.NotShot) removeShip();

    console.log(this.shipsCells.map((ship) => ship.length));
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

  isEditable() {
    if (this.isGameOver) return 'not';
    if (this.areShipsPlaced && this.isMyBoard) return 'not';
    if (!this.isYourMove && !this.isMyBoard) return 'not';
    return '';
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

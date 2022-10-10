import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoardService } from '../components/game/components/board/board.service';
import { Cell, CellType, GameData, Ship, ShipType } from '../shared/models';
import { SignalrService } from './signalr.service';

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

@Injectable({
  providedIn: 'root',
})
export class BattleshipService {
  private startGameSubject: Subject<void> = new Subject();
  private gameDataSubject: Subject<GameData> = new Subject();

  public isShipsPlaced = false;
  private ships: Ship[] = [];
  private shipsCells: Cell[][] = [];

  constructor(
    private readonly signalRService: SignalrService,
    private readonly boardService: BoardService
  ) {
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

  private placeShips(ships: Ship[]) {
    this.signalRService.send('placeShips', ships);
  }

  requestData() {
    this.signalRService.send('requestData');
  }

  // Registering event handlers
  private registerStartGameHandler() {
    this.signalRService.addEventListener('startGame', () => {
      this.startGameSubject.next();
    });
  }

  private registerGameDataHandler() {
    this.signalRService.addEventListener('gameData', (gameData) => {
      console.log(gameData);
      this.gameDataSubject.next(gameData);
    });
  }

  sendShips(ships: Ship[]) {
    this.sendShips(ships);
  }

  convertShips() {
    this.ships = [];
    this.shipsCells.forEach((ship) => {
      const firstCell = ship[0];
      const type = this.getShipType(ship);
      const isHorizontal = ship.every((cord) => cord.x === firstCell.x);
      const key = isHorizontal ? 'x' : 'y';
      const cell = ship
        .sort((a, b) => (a[key] <= b[key] ? -1 : 1))
        .at(0) as Cell;

      this.ships.push({
        isHorizontal,
        type,
        cell,
      });
    });
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
    if (lastCell.type === CellType.Empty) {
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
    if (lastCell.type === CellType.Empty)
      updateDiagonal(lastCell, CellType.Empty);

    shipCells.forEach((cell) =>
      updateDiagonal(cell, CellType.DisabledToPlaceShip)
    );
  }

  placeShip(cell: Cell) {
    if (cell.type == CellType.Empty) {
      cell.type = CellType.Ship;
      return;
    }
    if (cell.type == CellType.Ship) {
      cell.type = CellType.Empty;
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
      case CellType.DisabledToPlaceShip:
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

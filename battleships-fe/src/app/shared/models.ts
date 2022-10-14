export interface Player {
  name: string;
  connectionId: string;
  board: Board;
  placedShips: Ship[]
  areAllShipsPlaced: boolean,
}

export interface GameData {
  playerOne: Player;
  playerTwo: Player;
  allPlayersPlacedShips: boolean;
  isYourMove: boolean;
  isGameOver: boolean;
  winner: boolean;
}

export interface Cell {
  x: number;
  y: number;
  type: CellType;
}

export enum ShipType {
  Carrier, // 5 tiles
  Battleship, // 4 tiles
  Cruiser, // 3 tiles
  Submarine, // 3 tiles
  Destroyer, // 2 tiles
}

export interface Ship {
  type: ShipType;
  cell: Cell;
  isHorizontal: boolean;
}

export interface Board {
  cells: Cell[][];
  size: number;
}

export enum CellType {
  NotShot,
  Empty,
  Ship,
  DamagedShip,
  DestroyedShip,
  EmptyShot,
}

export interface Move {
  X: number;
  Y: number;
}

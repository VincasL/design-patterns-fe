export interface Player {
  name: string;
  connectionId: string;
  board: Board;
  placedShips: Ship[];
  placedMines: Mine[];
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

export enum MineType {
  Small,
  Huge,
  RemoteControlled
}


export enum MoveDirection{
  Up,
  Right,
  Down,
  Left
}

export interface Ship {
  type: ShipType;
  cell: Cell;
  isHorizontal: boolean;
}

export interface Mine {
  type: MineType;
  cell: Cell;
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
  Mine
}

export interface CellCoordinates {
  X: number;
  Y: number;
}

export interface Player{
  name: string;
  board: Board;
}

export interface GameData{
  playerOne: Player;
  playerTwo: Player;
  areShipsPlaced: boolean;

}

export interface Cell {
  x: number;
  y: number;
  type: CellType;
}

export enum ShipType
{
  Carrier, // 5 tiles
  Battleship, // 4 tiles
  Cruiser, // 3 tiles
  Submarine, // 3 tiles
  Destroyer // 2 tiles
}

export interface Ship {
  type: ShipType,
  cell: Cell
  isHorizontal: boolean
}

export interface Board {
  cells: Cell[][]
}

export enum CellType{
  NotShot,
  Empty,
  Ship,
  DamagedShip,
  DestroyedShip
}




export interface Player{
  name: string;
}

export interface GameData{
  playerOne: Player;
  playerTwo: Player;
}

export interface Cell {
  xCoord: number;
  yCoord: number;
  type: CellType;
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


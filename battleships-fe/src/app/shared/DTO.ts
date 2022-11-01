import {CellCoordinates, MineType, ShipType} from './models';

export interface PlaceShipDto {
  coordinates: CellCoordinates;
  type: ShipType;
}

export interface PlaceMineDto {
  coordinates: CellCoordinates;
  type: MineType
}

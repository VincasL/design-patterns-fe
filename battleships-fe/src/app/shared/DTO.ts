import { CellCoordinates, ShipType } from './models';

export interface PlaceShipDto {
  coordinates: CellCoordinates;
  type: ShipType;
}

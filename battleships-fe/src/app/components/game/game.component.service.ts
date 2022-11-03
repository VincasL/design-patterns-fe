import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CellCoordinates } from '../../shared/models';

export interface LastClickedCellData {
  coordinates: CellCoordinates;
  myBoard: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GameComponentService {
  private lastClickedCellSubject = new Subject<LastClickedCellData>();
  lastClickedCell$ = this.lastClickedCellSubject.asObservable();
  constructor() {}

  setLastClickedCell(data: LastClickedCellData) {
    this.lastClickedCellSubject.next(data);
  }
}

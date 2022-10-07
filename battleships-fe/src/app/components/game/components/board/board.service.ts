import { Injectable } from '@angular/core';
import { Board, Cell, CellType } from '../../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private _board: Board;

  get board(): Board {
    return this._board;
  }

  constructor() {
    this._board = this.createBoard();
  }

  createBoard(size: number = 10): Board {
    let cells: Cell[][] = [];
    for (let xCoord = 0; xCoord < size; xCoord++) {
      let row: Cell[] = [];
      for (let yCoord = 0; yCoord < size; yCoord++) {
        const cell: Cell = {
          x: xCoord,
          y: yCoord,
          type: CellType.Empty,
        };
        row.push(cell);
      }
      cells.push(row);
    }

    return { cells } as Board;
  }
}

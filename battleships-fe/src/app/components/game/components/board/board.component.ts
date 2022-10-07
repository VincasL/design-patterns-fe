import { Component, Input, OnInit } from '@angular/core';
import {BoardService} from "./board.service";
import {Board, Cell, CellType} from "../../../../shared/models";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() board?: Board;

  constructor() { }

  ngOnInit(): void {
  }

  onCellClick() {
  }

  getCellType(cell: Cell) {
    switch (cell.type)
    {
      case CellType.Empty:
        return "empty";
      case CellType.DamagedShip:
        return "damag"
      case CellType.DestroyedShip:
        return "destr"
      case CellType.NotShot:
        return "notsh"
      case CellType.Ship:
        return "ship"
    }
  }
}

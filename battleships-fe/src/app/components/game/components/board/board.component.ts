import { Component, Input, OnInit } from '@angular/core';
import {BoardService} from "./board.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() boardSize: number = 10;

  constructor(private readonly boardService: BoardService) { }

  board = this.boardService.board;

  ngOnInit(): void {
    this.boardService.createBoard();
  }

  onCellClick() {

  }
}

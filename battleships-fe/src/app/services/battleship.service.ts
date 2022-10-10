import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BoardService } from '../components/game/components/board/board.service';
import { CellType, GameData, Player, Ship, ShipType } from '../shared/models';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root',
})
export class BattleshipService {
  private startGameSubject: Subject<void> = new Subject();
  private gameDataSubject: Subject<GameData> = new Subject();

  constructor(
    private readonly signalRService: SignalrService,
    private readonly boardService: BoardService
  ) {
    this.registerStartGameHandler();
    this.registerGameDataHandler();
  }

  startGame$ = this.startGameSubject.asObservable();
  gameData$ = this.gameDataSubject.asObservable();

  startGame(name: string): Observable<void> {
    this.joinQueue(name);
    return this.startGame$;
  }

  // Sending events
  private joinQueue(name: string) {
    this.signalRService.send('joinQueue', name);
  }

  private placeShips(ships: Ship[]) {
    this.signalRService.send('placeShips', ships);
  }

  requestData() {
    this.signalRService.send('requestData');
  }

  // Registering event handlers
  private registerStartGameHandler() {
    this.signalRService.addEventListener('startGame', () => {
      this.startGameSubject.next();
    });
  }

  private registerGameDataHandler() {
    this.signalRService.addEventListener('gameData', (gameData) => {
      console.log(gameData);
      this.gameDataSubject.next(gameData);
    });
  }

  sendMockShipData() {
    const data = [
      {
        type: ShipType.Battleship,
        cell: { x: 0, y: 0 },
        isHorizontal: true,
      } as Ship,
      {
        type: ShipType.Carrier,
        cell: { x: 1, y: 1 },
        isHorizontal: true,
      },
      {
        type: ShipType.Cruiser,
        cell: { x: 2, y: 2 },
        isHorizontal: true,
      },
      {
        type: ShipType.Destroyer,
        cell: { x: 3, y: 3 },
        isHorizontal: true,
      },
      {
        type: ShipType.Submarine,
        cell: { x: 4, y: 4 },
        isHorizontal: true,
      },
    ] as Ship[];
    this.placeShips(data);
  }

  setMockGameSessionData() {
    const data = {
      playerOne: {
        name: 'Marinis',
        board: this.boardService.createBoard(10, CellType.Empty),
      } as Player,
      playerTwo: {
        name: 'Stepas',
        board: this.boardService.createBoard(10, CellType.NotShot),
      } as Player,
      areShipsPlaced: true,
    } as GameData;

    //Player one
    // data.playerOne.board.cells[0][0].type = CellType.Ship
    // data.playerOne.board.cells[0][1].type = CellType.Ship
    // data.playerOne.board.cells[0][2].type = CellType.Ship
    // data.playerOne.board.cells[0][3].type = CellType.Ship
    // data.playerOne.board.cells[1][0].type = CellType.DamagedShip
    // data.playerOne.board.cells[1][1].type = CellType.DamagedShip
    // data.playerOne.board.cells[1][2].type = CellType.Ship
    // data.playerOne.board.cells[2][0].type = CellType.DestroyedShip
    // data.playerOne.board.cells[2][1].type = CellType.DestroyedShip
    // data.playerOne.board.cells[2][2].type = CellType.DestroyedShip

    // //Player two (enemy)
    // data.playerTwo.board.cells[1][0].type = CellType.DamagedShip
    // data.playerTwo.board.cells[1][1].type = CellType.DamagedShip
    // data.playerTwo.board.cells[2][0].type = CellType.DestroyedShip
    // data.playerTwo.board.cells[2][1].type = CellType.DestroyedShip
    // data.playerTwo.board.cells[2][2].type = CellType.DestroyedShip

    this.gameDataSubject.next(data);
  }
}

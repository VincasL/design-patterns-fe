import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MockBoardService } from '../components/game/components/board/mock-board.service';
import {
  CellType,
  GameData,
  Move,
  Player,
  Ship,
  ShipType,
} from '../shared/models';
import { SignalrService } from './signalr.service';
import {GameDataSubject} from "../observer/GameDataSubject";

@Injectable({
  providedIn: 'root',
})
export class BattleshipService {
  private startGameSubject: Subject<void> = new Subject();
  private gameDataSubject: GameDataSubject = new GameDataSubject();

  constructor(
    private readonly signalRService: SignalrService,
    private readonly boardService: MockBoardService
  ) {
    this.registerStartGameHandler();
    this.registerGameDataHandler();
  }

  startGame$ = this.startGameSubject.asObservable();
  gameData$ = this.gameDataSubject;

  ships: Ship[] = [];

  startGame(name: string): Observable<void> {
    this.joinQueue(name);
    return this.startGame$;
  }

  // Sending events
  joinQueue(name: string) {
    this.signalRService.send('joinQueue', name);
  }

  saveShips() {
    this.signalRService.send('placeShips');
  }

  placeShip(ship: Ship) {
    this.signalRService.send('placeShip', ship);
  }

  undoShip(move: Move) {
    this.signalRService.send('undoPlaceShip', move)
  }

  rotateShip(move: Move) {
    this.signalRService.send('rotateShip', move)
  }

  makeMove(move: Move) {
    this.signalRService.send('makeMove', move);
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
      this.gameDataSubject.receiveGameData(gameData);
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
    data.forEach((item: Ship) => this.placeShip(item));
  }

  setMockGameSessionData() {
    const data = {
      playerOne: {
        name: 'Marinis',
        board: this.boardService.createBoard(10, CellType.NotShot),
        placedShips: [] as Ship[]
      } as Player,
      playerTwo: {
        name: 'Stepas',
        board: this.boardService.createBoard(10, CellType.NotShot),
        placedShips: [] as Ship[]
      } as Player,
      allPlayersPlacedShips: true,
    } as GameData;

    // Player one
    data.playerOne.board.cells[0][0].type = CellType.Ship;
    data.playerOne.board.cells[0][1].type = CellType.Ship;
    data.playerOne.board.cells[0][2].type = CellType.Ship;
    data.playerOne.board.cells[0][3].type = CellType.Ship;
    data.playerOne.board.cells[1][0].type = CellType.DamagedShip;
    data.playerOne.board.cells[1][1].type = CellType.DamagedShip;
    data.playerOne.board.cells[1][2].type = CellType.Ship;
    data.playerOne.board.cells[2][0].type = CellType.DestroyedShip;
    data.playerOne.board.cells[2][1].type = CellType.DestroyedShip;
    data.playerOne.board.cells[2][2].type = CellType.DestroyedShip;

    //Player two (enemy)
    data.playerTwo.board.cells[1][0].type = CellType.DamagedShip;
    data.playerTwo.board.cells[1][1].type = CellType.DamagedShip;
    data.playerTwo.board.cells[2][0].type = CellType.DestroyedShip;
    data.playerTwo.board.cells[2][1].type = CellType.DestroyedShip;
    data.playerTwo.board.cells[2][2].type = CellType.DestroyedShip;
    data.playerTwo.board.cells[2][2].type = CellType.Empty;


    this.gameDataSubject.receiveGameData(data);
  }

  async destroyAllShipsAndWinGame() {
    const delay = (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    const moves: Move[] = [];

    moves.push({ X: 0, Y: 0 });
    moves.push({ X: 0, Y: 1 });
    moves.push({ X: 0, Y: 2 });
    moves.push({ X: 0, Y: 3 });
    moves.push({ X: 1, Y: 1 });
    moves.push({ X: 1, Y: 2 });
    moves.push({ X: 1, Y: 3 });
    moves.push({ X: 1, Y: 4 });
    moves.push({ X: 1, Y: 5 });
    moves.push({ X: 2, Y: 2 });
    moves.push({ X: 2, Y: 3 });
    moves.push({ X: 2, Y: 4 });
    moves.push({ X: 3, Y: 3 });
    moves.push({ X: 3, Y: 4 });
    moves.push({ X: 4, Y: 4 });
    moves.push({ X: 4, Y: 5 });
    moves.push({ X: 4, Y: 6 });

    for (const move of moves) {
      await delay(1000);
      this.makeMove(move);
    }
  }

  assignNewConnectionId(connectionId: string) {
    this.signalRService.send('assignNewConnectionId', connectionId);
  }
}

import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {MockBoardService} from '../components/game/components/board/mock-board.service';
import {
  CellCoordinates,
  CellType,
  GameData,
  Mine,
  MineType,
  MoveDirection,
  Player,
  Ship,
  ShipType,
} from '../shared/models';
import {SignalrService} from './signalr.service';
import {GameDataSubject} from '../observer/GameDataSubject';

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
    this.addGameDataEventListener();
  }

  startGame$ = this.startGameSubject.asObservable();
  gameData$ = this.gameDataSubject;

  ships: Ship[] = [];

  delay = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  startGame(name: string,nation: string): Observable<void> {
    this.joinQueue(name,nation);
    return this.startGame$;
  }

  // Sending events
  joinQueue(name: string,nation: string) {
    this.signalRService.send('joinQueue', name,nation);
  }

  saveShips() {
    this.signalRService.send('placeShips');
  }

  placeShip(ship: Ship) {
    this.signalRService.send(
      'placeShip',
      { X: ship.cell.x, Y: ship.cell.y },
      ship.type
    );
  }

  placeMine(mine: Mine) {
    this.signalRService.send(
      'placeMine',
      { X: mine.cell.x, Y: mine.cell.y },
      mine.type
    );
  }

  undoShip(move: CellCoordinates) {
    this.signalRService.send('undoPlaceShip', move);
  }

  rotateShip(move: CellCoordinates) {
    this.signalRService.send('rotateShip', move);
  }

  makeMove(move: CellCoordinates) {
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

  private addGameDataEventListener() {
    this.signalRService.addEventListener('gameData', (gameData) => {
      this.gameDataSubject.receiveGameData(gameData);
      console.log(gameData);
    });
  }

  sendMockShipData() {
    const shipData = [
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

    const mineData = [
      {
        type: MineType.RemoteControlled,
        cell: { x: 8, y: 8 },
      } as Mine,
      {
        type: MineType.Small,
        cell: { x: 1, y: 1 }

      },
      {
        type: MineType.Huge,
        cell: { x: 3, y: 3 }
      },
    ] as Mine[];

    shipData.forEach((item: Ship) => this.placeShip(item));
    mineData.forEach((item: Mine) => this.placeMine(item));
  }

  setMockGameSessionData() {
    const data = {
      playerOne: {
        name: 'Marinis',
        board: this.boardService.createBoard(10, CellType.NotShot),
        placedShips: [] as Ship[],
      } as Player,
      playerTwo: {
        name: 'Stepas',
        board: this.boardService.createBoard(10, CellType.NotShot),
        placedShips: [] as Ship[],
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

  async makeRandomMoves() {
    for (let i = 0; i < 500; i++) {
      await this.delay(10);
      this.makeMove({X: this.getRndInteger(0, 10), Y: this.getRndInteger(0, 10)});
    }
  }

  assignNewConnectionId(connectionId: string) {
    this.signalRService.send('assignNewConnectionId', connectionId);
  }

  move(coordinates: CellCoordinates, direction: MoveDirection, isEnemyBoard: boolean = false)
  {
    this.signalRService.send('moveUnit', coordinates, direction, isEnemyBoard);
  }


  getRndInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) ) + min;
  }


}

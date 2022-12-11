import {Component, HostListener, Input, OnInit} from '@angular/core';
import {BattleshipService} from '../../../../services/battleship.service';
import {
  Board,
  Cell,
  CellType,
  GameData,
  Mine,
  MineType,
  MoveDirection,
  Ship,
  ShipType,
} from '../../../../shared/models';
import {GameDataObserver} from '../../../../observer/GameDataObserver';
import {GameComponentService, LastClickedCellData,} from '../../game.component.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  private gameData?: GameData;
  @Input() isMyBoard?: boolean = false;
  placingShips = true;
  lastClickedCell?: LastClickedCellData;
  currentlyPlacingShipType?: ShipType;
  currentlyPlacingMineType?: MineType;

  ShipType = ShipType;
  MineType = MineType;
  MoveDirection = MoveDirection;

  gameDataObserver: GameDataObserver = new GameDataObserver((gameData) => {
    this.gameData = gameData;
    this.placingShips = !gameData.playerOne.areAllShipsPlaced;
  });

  shipTypes = [
    ShipType.Carrier, // 5 tiles
    ShipType.Battleship, // 4 tiles
    ShipType.Cruiser, // 3 tiles
    ShipType.Submarine, // 3 tiles
    ShipType.Destroyer, // 2 tiles
  ];

  mineTypes: MineType[] = [
    MineType.Small,
    MineType.Huge,
    MineType.RemoteControlled,
  ];

  moveDirections = [
    MoveDirection.Down,
    MoveDirection.Left,
    MoveDirection.Up,
    MoveDirection.Right,
  ];

  constructor(
    private readonly battleshipService: BattleshipService,
    private readonly gameComponentService: GameComponentService
  ) {}

  ngOnInit(): void {
    this.battleshipService.gameData$.subscribe(this.gameDataObserver);
    this.gameComponentService.lastClickedCell$.subscribe(
      (data) => (this.lastClickedCell = data)
    );
  }

  get board(): Board | undefined {
    return this.isMyBoard
      ? this.gameData?.playerOne.board
      : this.gameData?.playerTwo.board;
  }

  onCellClick(cell: Cell, rightClick = false) {
    this.gameComponentService.setLastClickedCell({
      coordinates: { X: cell.x, Y: cell.y },
      myBoard: this.isMyBoard ?? true,
    });

    if (this.isMyBoard && this.placingShips) {
      if (cell.type === CellType.Ship) {
        if (rightClick) {
        } else {
        }
      } else {
        this.placeShip(cell);
      }
    } else if (!this.isMyBoard) {
      if (this.gameData?.isYourMove && this.gameData?.allPlayersPlacedShips) {
        this.battleshipService.makeMove({ X: cell.x, Y: cell.y });
      } else if (this.placingShips) {
        this.placeMine(cell);
      }
    }

    // prevent default click behaviour
    return false;
  }

  private cancelShip(cell: Cell) {
    this.battleshipService.undoShip({ X: cell.x, Y: cell.y });
  }

  private rotateShip(cell: Cell) {
    this.battleshipService.rotateShip({ X: cell.x, Y: cell.y });
  }

  private makeMove(cell: Cell) {
    this.battleshipService.makeMove({ X: cell.x, Y: cell.y });
  }

  isEditable() {
    if (this.gameData?.isGameOver) return 'not';
    if (this.gameData?.allPlayersPlacedShips && this.isMyBoard) return 'not';
    if (!this.gameData?.isYourMove && !this.isMyBoard) return 'not';
    return '';
  }
  //
  getCellType(cell: Cell) {
    switch (cell.type) {
      case CellType.Empty:
        return 'empty';
      case CellType.EmptyShot:
        return 'emptyshot';
      case CellType.DamagedShip:
        return 'damage';
      case CellType.DestroyedShip:
        return 'destroy';
      case CellType.NotShot:
        return 'notshot';
      case CellType.Ship:
        return 'ship';
      case CellType.Mine:
        return 'mine';
    }
  }

  shipIsPlaced(shipType: ShipType): boolean {
    const item = this.gameData?.playerOne.placedShips.find(
      (ship) => ship.type === shipType
    );
    return !!item;
  }

  mineIsPlaced(mineType: MineType): boolean {
    const item = this.gameData?.playerOne.placedMines.find(
      (mine) => mine.type === mineType
    );
    return !!item;
  }

  private placeShip(cell: Cell) {
    console.log(cell);
    if (this.currentlyPlacingShipType !== undefined) {
      const ship: Ship = {
        cell,
        type: this.currentlyPlacingShipType,
        isHorizontal: true,
      };
      this.battleshipService.placeShip(ship);
      this.currentlyPlacingShipType = undefined;
    }
  }

  private placeMine(cell: Cell) {
    console.log(cell);
    if (this.currentlyPlacingMineType !== undefined) {
      const mine: Mine = {
        cell,
        type: this.currentlyPlacingMineType,
      };
      this.battleshipService.placeMine(mine);
      this.currentlyPlacingMineType = undefined;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopImmediatePropagation();

    const isEnemyBoard = !this.lastClickedCell?.myBoard;

    if (!this.lastClickedCell || !this.placingShips && !this.isMyBoard) return;

    switch (event.code) {
      case KEY_CODE.DOWN_ARROW:
        this.battleshipService.move(this.lastClickedCell.coordinates, MoveDirection.Down, isEnemyBoard);

        if (this.lastClickedCell.coordinates.Y + 1 < 10) {
          this.lastClickedCell.coordinates.Y++;
        }

        break;
      case KEY_CODE.UP_ARROW:
        this.battleshipService.move(this.lastClickedCell.coordinates, MoveDirection.Up, isEnemyBoard);

        if (this.lastClickedCell.coordinates.Y > 0) {
          this.lastClickedCell.coordinates.Y--;
        }
        break;
      case KEY_CODE.LEFT_ARROW:
        this.battleshipService.move(this.lastClickedCell.coordinates, MoveDirection.Left, isEnemyBoard);

        if (this.lastClickedCell.coordinates.X > 0) {
          this.lastClickedCell.coordinates.X--;
        }
        break;
      case KEY_CODE.RIGHT_ARROW:
        this.battleshipService.move(this.lastClickedCell.coordinates, MoveDirection.Right, isEnemyBoard);

        if (this.lastClickedCell.coordinates.X + 1 < 10) {
          this.lastClickedCell.coordinates.X += 1;
        }
        break;
      case KEY_CODE.DELETE:
        this.battleshipService.undoShip(this.lastClickedCell.coordinates);
        break;
      case KEY_CODE.SPACE:
        this.battleshipService.rotateShip(this.lastClickedCell.coordinates);
        break;
      default:
        break;
    }

    if(event.code != KEY_CODE.DELETE)
    {
    }
  }
}

export enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  DELETE = 'Delete',
  SPACE = 'Space'
}

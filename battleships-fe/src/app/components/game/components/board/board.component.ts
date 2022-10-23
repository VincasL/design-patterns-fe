import { Component, Input, OnInit } from '@angular/core';
import { BattleshipService } from '../../../../services/battleship.service';
import {
  Board,
  Cell,
  CellCoordinates,
  CellType,
  GameData,
  MoveDirection,
  Ship,
  ShipType,
} from '../../../../shared/models';
import { GameDataObserver } from '../../../../observer/GameDataObserver';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  private gameData?: GameData;
  @Input() isMyBoard?: boolean = false;
  placingShips = true;
  currentlyPlacingShipType?: ShipType;
  currentlyMovingDirection?: MoveDirection = undefined;

  ShipType = ShipType;
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

  moveDirections = [
    MoveDirection.Down,
    MoveDirection.Left,
    MoveDirection.Up,
    MoveDirection.Right,
  ];

  constructor(private readonly battleshipService: BattleshipService) {}

  ngOnInit(): void {
    this.battleshipService.gameData$.subscribe(this.gameDataObserver);
  }

  get board(): Board | undefined {
    return this.isMyBoard
      ? this.gameData?.playerOne.board
      : this.gameData?.playerTwo.board;
  }

  onCellClick(cell: Cell, rightClick = false) {
    if (this.isMyBoard && this.placingShips) {
      if (cell.type === CellType.Ship) {
        if (rightClick) {
          this.cancelShip(cell);
        } else {
          if (this.currentlyMovingDirection !== undefined) {
            this.moveShip(this.currentlyMovingDirection, {
              X: cell.x,
              Y: cell.y,
            } as CellCoordinates);
          } else {
            this.rotateShip(cell);
          }
        }
      } else {
        this.placeShip(cell);
      }
    } else if (!this.isMyBoard && this.gameData?.isYourMove) {
      this.battleshipService.makeMove({ X: cell.x, Y: cell.y });
    }

    // prevent default click behaviour
    return false;
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
    }
  }

  shipIsPlaced(shipType: ShipType): boolean {
    const item = this.gameData?.playerOne.placedShips.find(
      (ship) => ship.type === shipType
    );
    return !!item;
  }

  currentlyMoving(direction: MoveDirection | undefined) {
    this.currentlyMovingDirection = direction;
  }

  private moveShip(
    direction:
       MoveDirection,
    coordinates: CellCoordinates
  ) {
    switch (direction) {
      case MoveDirection.Up:
        this.battleshipService.moveUp(coordinates);
        break;
      case MoveDirection.Right:
        this.battleshipService.moveRight(coordinates);
        break;
      case MoveDirection.Down:
        this.battleshipService.moveDown(coordinates);
        break;
      case MoveDirection.Left:
        this.battleshipService.moveLeft(coordinates);
        break;
    }

  }
}

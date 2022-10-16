import { Observer } from './Observer';
import { GameData } from '../shared/models';

export class GameDataObserver extends Observer {
  private readonly _callbackFn;

  constructor(callbackFn: (data: GameData) => void) {
    super();
    this._callbackFn = callbackFn;
  }

  override update(data: GameData) {
    this._callbackFn(data);
  }
}

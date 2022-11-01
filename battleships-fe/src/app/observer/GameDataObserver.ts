import { Observer } from './Observer';
import { GameData } from '../shared/models';

export class GameDataObserver extends Observer {

  constructor(callbackFn: (data: GameData) => void) {
    super();
    super._callbackFn = callbackFn;
  }

  override update(data: GameData) {
    super.update(data);
  }
}

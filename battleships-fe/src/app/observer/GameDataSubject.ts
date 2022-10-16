import {GameData} from "../shared/models";
import {Subject} from "./Subject";
import {GameDataObserver} from "./GameDataObserver";

export class GameDataSubject extends Subject{
  override observers = [];
  override _data: GameData = {} as GameData;

  override receiveGameData(data: GameData) {
    super.receiveGameData(data);
  }

  override subscribe(observer: GameDataObserver) {
    super.subscribe(observer);
  }

  override unsubscribe(observer: GameDataObserver) {
    super.unsubscribe(observer);
  }
}

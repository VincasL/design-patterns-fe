import { Observer } from './Observer';

export abstract class Subject {
  observers: Observer[] = [];
  _data: unknown;

  send() {
    this.observers.forEach((observer) => {
      observer.update(this._data);
    });
  }
  receiveGameData(data: unknown) {
    this._data = data;
    this.send();
  }
  subscribe(observer: Observer) {
    this.observers.push(observer);
  }
  unsubscribe(observer: Observer) {
    this.observers.filter((x) => x != observer);
  }
}

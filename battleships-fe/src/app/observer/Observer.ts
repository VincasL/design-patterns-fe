export abstract class Observer {
  _callbackFn: (x?: any) => void = () => {};

  update(data: unknown) {
    this._callbackFn(data);
  }
}

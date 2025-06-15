export class TableCell {
  constructor(
    private _collumn: number,
    private _line: number,
    private _position: cc.Vec2,
    private _free: boolean
  ) {}

  getCollumn() {
    return this._collumn;
  }
  getLine() {
    return this._line;
  }
  getPosition() {
    return this._position;
  }
  isFree() {
    return this._free;
  }
  setFree(free: boolean) {
    this._free = free;
  }
}

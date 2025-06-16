import Tile from "../tile";
import { TableCell } from "../table-cell";

export class TableModel {
  constructor(private _tableCells: TableCell[][], private _tiles: Tile[][]) {}

  getTableCells() {
    return this._tableCells;
  }
  getTiles() {
    return this._tiles;
  }
}

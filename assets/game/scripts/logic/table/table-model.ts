import type { TableCell } from "../table-cell";
import type { ITile } from "../tile";

interface ITileGrid {
  getTableCells();
  getTiles();
  getTile(col: number, row: number): ITile;
  setTile(col: number, row: number, tile: ITile);
  getCell(col: number, row: number);
  getTilePosition(tile: ITile): { col: number; row: number };
  getTileCount(): { columns: number; rows: number };
}
export interface ITableModel extends ITileGrid {
  onAddTileAction?: (tile: ITile, cell: TableCell) => void;
  onMoveTileAction?: (tile: ITile, pos: cc.Vec2) => void;
  onClearModelAction?: (tile: ITile) => void;

  onAddTile(tile: ITile, cell: TableCell);
  onMoveTile(tile: ITile, pos: cc.Vec2);
  clearTable();
}

export class TableModel implements ITableModel {
  onAddTileAction?: (tile: ITile, cell: TableCell) => void;
  onMoveTileAction?: (tile: ITile, pos: cc.Vec2) => void;
  onClearModelAction?: (tile: ITile) => void;
  constructor(
    private _tableCells: TableCell[][],
    private _tiles: ITile[][],
  ) {}
  onAddTile(tile: ITile, cell: TableCell) {
    if (this.onAddTileAction) this.onAddTileAction(tile, cell);
  }
  onMoveTile(tile: ITile, pos: cc.Vec2) {
    if (this.onMoveTileAction) this.onMoveTileAction(tile, pos);
  }
  getTableCells() {
    return this._tableCells;
  }
  getTiles() {
    return this._tiles;
  }
  getTile(col: number, row: number): ITile {
    return this.getTiles()[col][row];
  }
  setTile(col: number, row: number, tile: ITile) {
    this.getTiles()[col][row] = tile;
  }
  getCell(col: number, row: number) {
    return this.getTableCells()[col][row];
  }
  getTilePosition(tile: ITile): { col: number; row: number } {
    const tiles = this.getTiles();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        if (tiles[col][row] === tile) {
          return { col, row };
        }
      }
    }
    return { col: -1, row: -1 };
  }
  getTileCount(): { columns: number; rows: number } {
    const tiles = this.getTiles();
    return { columns: tiles.length, rows: tiles[0]?.length || 0 };
  }

  clearTable(): void {
    const tiles = this.getTiles();
    const cells = this.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile = tiles[col][row];
        if (tile) {
          this.onClearModelAction(tile);
          tiles[col][row] = null;
          cells[col][row].setFree(true);
        }
      }
    }
  }
}

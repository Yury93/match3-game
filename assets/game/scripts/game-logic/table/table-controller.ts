import type { IVfxFactory } from "../../infrastructure/services/factories/vfx-factory";
import type { IMechanicController } from "../game-mechanic/mechanic-controller";
import type { TableCell } from "../table-cell";
import type { ITile } from "../tile";

import type { ITableModel } from "./table-model";
import type { ITableView } from "./table-view";

export interface ITableController {
  onSwap(tile: ITile);
  beforeBurnGroupAction(tile: ITile, length: number);
  beforeBombAction(tile: ITile, length: number);
  removeClickTileListeners();
  onDeselectTile(tile: ITile);
  onSelectTile(tile: ITile);
  onBombAction(tile: ITile);
  onBurnAction: (groupSize: number) => void;
  onFalseBurnedAction: (tile: ITile) => void;
  onEndTurnAction: () => void;
  init();
  setMechanicController(controller: IMechanicController);
  moveTileOnView(tile: ITile, pos: cc.Vec2);
  addTileOnView(tile: ITile, cell: TableCell);
  onClearTile(tile: ITile);
  onFalseBurned(tile: ITile);
  onTileClick(tile: ITile);
  onTurnEnd();
  resetTable();
}

export class TableController implements ITableController {
  onBurnAction: (groupSize: number) => void;
  onEndTurnAction: () => void;
  onFalseBurnedAction: (tile: ITile) => void;
  private _mechanicController: IMechanicController;
  private readonly _addTileOffsetPositionY = 500;
  constructor(
    private _tableView: ITableView,
    private _model: ITableModel,
    private _vfxFactory: IVfxFactory,
  ) {
    this.init();
  }
  onSwap(tile: ITile) {
    this._vfxFactory.createVfxMessage(tile.nodeTile, `а это хак`);
  }
  beforeBurnGroupAction(tile: ITile, length: number) {
    this._vfxFactory.createVfxMessage(tile.nodeTile, `+${length} очков!`);
  }
  beforeBombAction(tile: ITile, length: number) {
    this._vfxFactory.createVfxMessage(
      tile.nodeTile,
      `Забудь, что сейчас было +${length}`,
    );
  }

  init() {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile: ITile = tiles[col][row];
        if (tile) {
          tile.addListener(() => this.onTileClick(tile));
          const startPosition = cells[col][row].getPosition();
          this._tableView.addTile(tile, cells[col][row], startPosition);
        }
      }
    }
    this._model.onDropTileAction = (tile, newPosiotn) =>
      this.moveTileOnView(tile, newPosiotn);
    this._model.onSwapTileAction = (tile2, pos) =>
      this.swapTileOnView(tile2, pos);

    this._model.onAddTileAction = (tile, cell) =>
      this.addTileOnView(tile, cell);

    this._model.onClearModelAction = (tile) => this.onClearTile(tile);
    this.onFalseBurnedAction = (tile) => {
      this._vfxFactory.createVfxMessage(tile.nodeTile, "неуязвимая плитка!");
      this._tableView.showFalseBurnMessage(tile);
    };
  }
  swapTileOnView(tile: ITile, pos: cc.Vec2): void {
    this._tableView.swapTile(tile, pos);
  }
  setMechanicController(controller: IMechanicController) {
    this._mechanicController = controller;
  }
  moveTileOnView(tile: ITile, pos: cc.Vec2) {
    this._tableView.moveTile(tile, pos);
  }
  addTileOnView(tile: ITile, cell: TableCell) {
    const pos = cell.getPosition();
    const startPosition = new cc.Vec2(
      pos.x,
      this._addTileOffsetPositionY + pos.y,
    );
    this._tableView.addTile(tile, cell, startPosition);
    tile.addListener(() => this.onTileClick(tile));

    this.moveTileOnView(tile, pos);
  }

  onClearTile(tile: ITile) {
    tile.removeListener();
    this._tableView.removeTile(tile);
  }

  onTileClick(tile: ITile) {
    this._mechanicController.onTileClick(tile);
  }

  onBombAction(tile: ITile) {
    this._vfxFactory.createVfxBomb(tile);
  }
  onDeselectTile(tile: ITile) {
    tile.setActiveHightlight(false);
  }
  onSelectTile(tile: ITile) {
    this._vfxFactory.createVfxMessage(
      tile.nodeTile,
      "сквозь пространство и время",
    );
    tile.setActiveHightlight(true);
  }
  resetTable() {
    this._model.clearTable();
  }
  removeClickTileListeners() {
    const tiles = this._model.getTiles();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile: ITile = tiles[col][row];
        if (tile) {
          tile.removeListener();
        }
      }
    }
  }
  onFalseBurned() {}
  onTurnEnd() {
    if (this.onEndTurnAction) this.onEndTurnAction();
  }
}

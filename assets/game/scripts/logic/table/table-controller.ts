import { IVfxFactory } from "../../infrastructure/services/gameFactory/vfx-factory";
import { IMechanicController } from "../game-mechanic/mechanic-controller";
import { TableCell } from "../table-cell";
import { ITile } from "../tile";
import { ITableModel } from "./table-model";
import { ITableView } from "./table-view";

export interface ITableController {
  removeClickTileListeners();
  onDeselectTile(tile: ITile);
  onSelectTile(tile: ITile);
  onBombAction(tile: ITile);
  onBurnAction: (groupSize: number) => void;
  onFalseBurnedAction: () => void;
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
  onFalseBurnedAction: () => void;
  private _mechanicController: IMechanicController;

  constructor(
    private _tableView: ITableView,
    private _model: ITableModel,
    private _vfxFactory: IVfxFactory
  ) {
    this.init();
  }

  init() {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile: ITile = tiles[col][row];
        if (tile) {
          tile.addListener(() => this.onTileClick(tile));
          this._tableView.addTile(tile, cells[col][row]);
        }
      }
    }
    this._model.onMoveTileAction = (tile, newPosiotn) =>
      this.moveTileOnView(tile, newPosiotn);

    this._model.onAddTileAction = (tile, cell) =>
      this.addTileOnView(tile, cell);

    this._model.onClearModelAction = (tile) => this.onClearTile(tile);
  }
  setMechanicController(controller: IMechanicController) {
    this._mechanicController = controller;
  }
  moveTileOnView(tile: ITile, pos: cc.Vec2) {
    this._tableView.moveTile(tile, pos);
  }
  addTileOnView(tile: ITile, cell: TableCell) {
    this._tableView.addTile(tile, cell);
    tile.addListener(() => this.onTileClick(tile));
  }

  onClearTile(tile: ITile) {
    tile.removeListener();
    this._tableView.removeTile(tile);
  }

  onFalseBurned(tile: ITile) {
    this._tableView.showFalseBurnMessage(tile);
    if (this.onFalseBurnedAction) this.onFalseBurnedAction();
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
  onTurnEnd() {
    if (this.onEndTurnAction) this.onEndTurnAction();
  }
}

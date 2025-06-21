import { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import { IVfxFactory } from "../../infrastructure/services/gameFactory/vfx-factory";
import { IMechanicController } from "../game-mechanic/mechanic-controller";
import { TableCell } from "../table-cell";
import Tile, { ITile } from "../tile";
import { ITableModel } from "./table-model";
import { ITableView } from "./table-view";

export interface ITableController {
  onBombAction(tile: ITile): unknown;
  onBurn?: (groupSize: number) => void;

  init();
  setMechanicController(controller: IMechanicController);
  moveTileOnView(tile: ITile, pos: cc.Vec2);
  addTileOnView(tile: ITile, cell: TableCell);
  onClearTile(tile: ITile);
  onFalseBurned(tile: ITile);
  onTileClick(tile: ITile);
  onTurnEnd();
}

export class TableController implements ITableController {
  public onBurn?: (groupSize: number) => void;
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
    this._model.onClearModelAction = (tile) => this.onClearTile(tile);
    this._model.onAddTileAction = (tile, cell) =>
      this.addTileOnView(tile, cell);
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
  }
  onTileClick(tile: ITile) {
    this._mechanicController.onTileClick(tile);
  }

  onTurnEnd() {
    this._mechanicController.onTurnEnd();
  }
  onBombAction(tile: ITile) {
    this._vfxFactory.createVfxBomb(tile);
  }
}

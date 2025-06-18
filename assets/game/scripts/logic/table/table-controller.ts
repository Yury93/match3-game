import { IGameFactory } from "../../infrastructure/services/gameFactory/game-factory";
import { IMechanicService } from "../../infrastructure/services/mechanic-service";
import { BasicMechanic } from "../game-mechanic/basic-mechanic";
import { BoosterBomb } from "../game-mechanic/booster-bomb";
import Tile from "../tile";
import { TableModel } from "./table-model";
import TableView from "./table-view";

export class TableController {
  public onBurn?: (groupSize: number) => void;
  private _mechanicService: IMechanicService;

  constructor(
    private _gameFactory: IGameFactory,
    private _tableView: TableView,
    private _model: TableModel,
    mechanicService: IMechanicService
  ) {
    this._mechanicService = mechanicService;

    const basicMachanic = new BasicMechanic();
    const bombMechanic = new BoosterBomb(_gameFactory);
    this._mechanicService.init([basicMachanic, bombMechanic]);
    this._mechanicService.setActiveMechanic(basicMachanic);

    this.init();
  }

  getTile(col: number, row: number): Tile {
    return this._model.getTiles()[col][row];
  }
  setTile(col: number, row: number, tile: Tile) {
    this._model.getTiles()[col][row] = tile;
  }
  getCell(col: number, row: number) {
    return this._model.getTableCells()[col][row];
  }
  getTilePosition(tile: Tile): { col: number; row: number } {
    const tiles = this._model.getTiles();
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
    const tiles = this._model.getTiles();
    return { columns: tiles.length, rows: tiles[0]?.length || 0 };
  }
  removeTile(tile: Tile) {
    this._tableView.removeTile(tile);
  }
  moveTile(tile: Tile, pos: cc.Vec2) {
    this._tableView.moveTile(tile, pos);
  }
  addTile(tile: Tile, cell) {
    this._tableView.addTile(tile, cell);
    tile.sprite.node.on(
      cc.Node.EventType.TOUCH_END,
      () => this.onTileClick(tile),
      this
    );
  }
  createRandomTile(cell): Tile {
    const tileModel = this._gameFactory.getRandomTileModel();
    const newTile = this._gameFactory.createTile(
      tileModel.tileType,
      tileModel.sprite,
      this._tableView.getContent(),
      cell
    );
    return newTile;
  }

  init() {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile = tiles[col][row];
        if (tile) {
          tile.sprite.node.on(
            cc.Node.EventType.TOUCH_END,
            () => this.onTileClick(tile),
            this
          );
          this._tableView.addTile(tile, cells[col][row]);
        }
      }
    }
  }
  onNoBurned(tile: Tile) {
    this._tableView.showNoBurnMessage(tile);
  }
  onTileClick(tile: Tile) {
    this._mechanicService.onTileClick(tile, this);
  }

  onTurnEnd() {
    this._mechanicService.onTurnEnd(this);
  }

  clearTable(): void {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        const tile = tiles[col][row];
        if (tile) {
          tile.sprite.node.off(
            cc.Node.EventType.TOUCH_END,
            () => this.onTileClick(tile),
            this
          );
          this._tableView.removeTile(tile);
          tiles[col][row] = null;
          cells[col][row].setFree(true);
        }
      }
    }
  }
}

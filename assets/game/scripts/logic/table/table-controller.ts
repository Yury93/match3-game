import TableView from "./table-view";
import { TableModel } from "./table-model";
import Tile from "../tile";
import { IGameFactory } from "../../infrastructure/services/gameFactory/game-factory";

export class TableController {
  public onBurn?: (groupSize: number) => void;
  constructor(
    private _gameFactory: IGameFactory,
    private _tableView: TableView,
    private _model: TableModel
  ) {
    this.init();
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

  onTileClick(tile: Tile) {
    const group = this.findConnectedTiles(tile);
    console.log("click tile, group: ", group.length);
    if (group.length < 2) return;

    this.burnTiles(group);
    this.dropTiles();
    this.fillEmpty();

    if (this.onBurn) this.onBurn(group.length);
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
  // Поиск всех прилегающих тайлов того же цвета (DFS)
  private findConnectedTiles(startTile: Tile): Tile[] {
    const tiles = this._model.getTiles();
    const visited = new Set<Tile>();
    const stack: Tile[] = [startTile];
    const type = startTile.tileType;
    console.log("check length stack: ", stack.length);
    while (stack.length > 0) {
      const tile = stack.pop();
      if (!tile || visited.has(tile)) continue;
      if (tile.tileType !== type) continue;
      visited.add(tile);

      const { col, row } = this.getTilePosition(tile);
      // Проверяем соседей (вверх, вниз, влево, вправо)
      [
        [col - 1, row],
        [col + 1, row],
        [col, row - 1],
        [col, row + 1],
      ].forEach(([c, r]) => {
        if (
          tiles[c] &&
          tiles[c][r] &&
          !visited.has(tiles[c][r]) &&
          tiles[c][r].tileType === type
        ) {
          stack.push(tiles[c][r]);
        }
      });
    }
    return Array.from(visited);
  }

  // Получить позицию тайла в сетке
  private getTilePosition(tile: Tile): { col: number; row: number } {
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

  private burnTiles(group: Tile[]) {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    group.forEach((tile) => {
      const { col, row } = this.getTilePosition(tile);
      if (col >= 0 && row >= 0) {
        tile.sprite.node.off(
          cc.Node.EventType.TOUCH_END,
          () => this.onTileClick(tile),
          this
        );
        this._tableView.removeTile(tile);
        tiles[col][row] = null;
        cells[col][row].setFree(true);
      }
    });
  }

  // Опускание тайлов вниз
  private dropTiles() {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = tiles[col].length - 1; row >= 0; row--) {
        if (!tiles[col][row]) {
          for (let k = row - 1; k >= 0; k--) {
            if (tiles[col][k]) {
              tiles[col][row] = tiles[col][k];
              tiles[col][k] = null;
              this._tableView.moveTile(
                tiles[col][row],
                cells[col][row].getPosition()
              );
              cells[col][row].setFree(false);
              cells[col][k].setFree(true);
              break;
            }
          }
        }
      }
    }
  }

  // Заполнение пустых ячеек новыми тайлами
  private fillEmpty() {
    const tiles = this._model.getTiles();
    const cells = this._model.getTableCells();
    for (let col = 0; col < tiles.length; col++) {
      for (let row = 0; row < tiles[col].length; row++) {
        if (!tiles[col][row]) {
          const tileModel = this._gameFactory.getRandomTileModel();
          const newTile = this._gameFactory.createTile(
            tileModel.tileType,
            tileModel.sprite,
            this._tableView.getContent(),
            cells[col][row]
          );
          newTile.sprite.node.on(
            cc.Node.EventType.TOUCH_END,
            () => this.onTileClick(newTile),
            this
          );
          tiles[col][row] = newTile;
          cells[col][row].setFree(false);
          this._tableView.addTile(newTile, cells[col][row]);
        }
      }
    }
  }
}

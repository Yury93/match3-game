import { IService } from "../serviceLocator";
import { IAssetProvider } from "./asset-provider";
import { PREFABS, TABLE, TILE_MODELS } from "../../../configs/configs";
import Tile from "../../../logic/tile";
import { TableCell } from "../../../logic/table-cell";
import TableView from "../../../logic/table/table-view";
import { TableModel } from "../../../logic/table/table-model";
import UiPanelView from "../../../ui/ui-panel";
import Curtain from "../../../curtain/curtain";
import { TableController } from "../../../logic/table/table-controller";
import { IMechanicService, MechanicService } from "../mechanic-service";
import { TileType } from "../../../logic/tile-type";

export interface IGameFactory extends IService {
  loadAssets();
  createTableView(): TableView;
  createTiles(cells: TableCell[][], tableContent: cc.Node): Tile[][];
  createTile(
    tileType: TileType,
    spriteFrame: cc.SpriteFrame,
    content: cc.Node,
    tileCell: TableCell
  );
  getRandomTileModel(): { tileType: TileType; sprite: cc.SpriteFrame };
  createTableCells(content: cc.Node): TableCell[][];
  createTableModel(tableCell: TableCell[][], tiles: Tile[][]): TableModel;
  createTableController(
    tableView: TableView,
    tableModel: TableModel,
    mechanicService: IMechanicService
  );
  createUiPanelView(): UiPanelView;
  createCurtain(): Curtain;
  createBombEffect(node: cc.Node);
}

export class GameFactory implements IGameFactory {
  constructor(private _assetProvider: IAssetProvider) {}

  async loadAssets() {
    await this._assetProvider.loadAsset(PREFABS.curtainPrefab);
    await this._assetProvider.loadAsset(PREFABS.tablePrefab);
    await this._assetProvider.loadAsset(PREFABS.tilePrefab);
    await this._assetProvider.loadAsset(PREFABS.UIPanelPrefab);
    await this._assetProvider.loadAsset(PREFABS.BombEffectPrefab);
    await Promise.all(
      TILE_MODELS.map((tileModel) =>
        this._assetProvider.loadAsset(tileModel.path)
      )
    );
  }
  createBombEffect(node: cc.Node) {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const bombEffect = this._assetProvider.instantiateAsset(
        PREFABS.BombEffectPrefab
      );

      const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
      const localPos = director.convertToNodeSpaceAR(worldPos);

      bombEffect.setParent(director);
      bombEffect.setPosition(localPos);
    } catch (error) {
      console.error("Failed to create curtain:", error);
    }
  }
  createTableView(): TableView {
    try {
      return this.instantiateOnCanvas(PREFABS.tablePrefab, TableView);
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  }
  createUiPanelView(): UiPanelView {
    try {
      return this.instantiateOnCanvas(PREFABS.UIPanelPrefab, UiPanelView);
    } catch (error) {
      console.error("Failed to create UI panel:", error);
    }
  }
  createCurtain() {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const curtain: Curtain = this._assetProvider
        .instantiateAsset(PREFABS.curtainPrefab)
        .getComponent(Curtain);

      curtain.node.setParent(director);
      curtain.node.setPosition(0, 0);
      return curtain;
    } catch (error) {
      console.error("Failed to create curtain:", error);
    }
  }
  createTableController(
    tableView: TableView,
    tableModel: TableModel,
    mechanicService: IMechanicService
  ) {
    return new TableController(this, tableView, tableModel, mechanicService);
  }
  createTableModel(tableCells: TableCell[][], tiles: Tile[][]): TableModel {
    const tableModel: TableModel = new TableModel(tableCells, tiles);
    return tableModel;
  }
  createTiles(cells: TableCell[][], tableContent: cc.Node): Tile[][] {
    const tiles: Tile[][] = [];

    for (let col = 0; col < cells.length; col++) {
      tiles[col] = [];
      for (let row = 0; row < cells[col].length; row++) {
        const cell = cells[col][row];
        if (cell.isFree()) {
          const tileModel = this.getRandomTileModel();
          const tile = this.createTile(
            tileModel.tileType,
            tileModel.sprite,
            tableContent,
            cell
          );
          cell.setFree(false);
          tiles[col][row] = tile;
        } else {
          tiles[col][row] = null;
        }
      }
    }
    return tiles;
  }
  getRandomTileModel(): { tileType: TileType; sprite: cc.SpriteFrame } {
    const mathRnd = Math.random();
    const rnd = Math.floor(mathRnd * TILE_MODELS.length);
    const model = TILE_MODELS[rnd];
    const spritePath = model.path;
    const tileType = model.type;

    const texture = this._assetProvider.getAsset(spritePath);

    const spriteFrame = new cc.SpriteFrame();
    spriteFrame.setTexture(texture);

    const tileModel = { tileType: tileType, sprite: spriteFrame };
    return tileModel;
  }

  createTile(
    tileType: TileType,
    spriteFrame: cc.SpriteFrame,
    content: cc.Node,
    tileCell: TableCell
  ): Tile {
    try {
      const tile: Tile = this._assetProvider
        .instantiateAsset(PREFABS.tilePrefab)
        .getComponent(Tile);

      tile.node.setParent(content);
      tile.node.setPosition(tileCell.getPosition());

      tile.Init(tileType, spriteFrame);
      return tile;
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  }
  createTableCells(content: cc.Node): TableCell[][] {
    const grid: TableCell[][] = [];
    const columns = TABLE.column;
    const lines = TABLE.lines;

    const cellWidth = TABLE.grid;
    const cellHeight = TABLE.grid;

    const startX = -((columns - 1) * cellWidth) / 2;
    const startY = ((lines - 1) * cellHeight) / 2;

    for (let col = 0; col < columns; col++) {
      grid[col] = [];
      for (let line = 0; line < lines; line++) {
        const pos = new cc.Vec2(
          startX + col * cellWidth,
          startY - line * cellHeight
        );
        const cell = new TableCell(col, line, pos, true);
        grid[col][line] = cell;
      }
    }
    return grid;
  }
  private instantiateOnCanvas<T extends cc.Component>(
    prefabPath: string,
    component: { new (): T }
  ): T {
    const director = cc.director.getScene().getChildByName("Canvas");
    const instance: T = this._assetProvider
      .instantiateAsset(prefabPath)
      .getComponent(component);

    instance.node.setParent(director);
    instance.node.setPosition(0, 0);

    return instance;
  }
}

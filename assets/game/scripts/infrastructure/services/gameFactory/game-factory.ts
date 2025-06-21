import { IService } from "../serviceLocator";
import { IAssetProvider } from "./asset-provider";
import { PREFABS, TABLE, TILE_MODELS } from "../../../configs/configs";
import Tile, { ITile } from "../../../logic/tile";
import { TableCell } from "../../../logic/table-cell";
import TableView, { ITableView } from "../../../logic/table/table-view";
import { ITableModel, TableModel } from "../../../logic/table/table-model";
import Curtain from "../../../curtain/curtain";
import { TableController } from "../../../logic/table/table-controller";
import { ITileFactory } from "./tile-factory";
import { UiPanelView } from "../../../ui/ui-panel";
import { IVfxFactory, VfxFactory } from "./vfx-factory";
import { IMechanicController } from "../../../logic/game-mechanic/mechanic-controller";

export interface IGameFactory extends IService {
  loadAssets();
  createTableView(): TableView;
  createTableCells(content: cc.Node): TableCell[][];
  createTableModel(tableCell: TableCell[][], tiles: ITile[][]): TableModel;
  createTableController(
    tableView: ITableView,
    tableModel: ITableModel,
    vfxFactory: IVfxFactory
  );
  createUiPanelView(): UiPanelView;
  createCurtain(): Curtain;
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
    tableView: ITableView,
    tableModel: ITableModel,
    vfxFactory: IVfxFactory
  ) {
    const tableController = new TableController(
      tableView,
      tableModel,
      vfxFactory
    );
    return tableController;
  }
  createTableModel(tableCells: TableCell[][], tiles: Tile[][]): TableModel {
    const tableModel: TableModel = new TableModel(tableCells, tiles);
    return tableModel;
  }

  createTableCells(content: cc.Node): TableCell[][] {
    const grid: TableCell[][] = [];
    const id = Math.floor(Math.random() * TABLE.length);
    const tableConfig = TABLE[id];
    const columns = tableConfig.column;
    const lines = tableConfig.lines;

    const cellWidth = tableConfig.grid;
    const cellHeight = tableConfig.grid;

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

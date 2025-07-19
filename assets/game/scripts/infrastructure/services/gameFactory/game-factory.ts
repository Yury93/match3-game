import type { IService } from "../serviceLocator";
import type { ITableView } from "../../../logic/table/table-view";
import { TableView } from "../../../logic/table/table-view";
import { TableCell } from "../../../logic/table-cell";
import type { ITile } from "../../../logic/tile";
import type { ITableModel } from "../../../logic/table/table-model";
import { TableModel } from "../../../logic/table/table-model";
import { UiPanelView } from "../../../ui/ui-panel";
import { Curtain } from "../../../curtain/curtain";
import type {
  IPrefabsConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../../configs/config-types";
import { TableController } from "../../../logic/table/table-controller";

import type { IAssetProvider } from "./asset-provider";
import type { IVfxFactory } from "./vfx-factory";

export interface IGameFactory extends IService {
  loadAssets();
  createTableView(): TableView;
  createTableCells(content: cc.Node): TableCell[][];
  createTableModel(tableCell: TableCell[][], tiles: ITile[][]): TableModel;
  createTableController(
    tableView: ITableView,
    tableModel: ITableModel,
    vfxFactory: IVfxFactory,
  );
  createUiPanelView(): UiPanelView;
  createCurtain(): Curtain;
}

export class GameFactory implements IGameFactory {
  private _assetProvider: IAssetProvider;
  private _prefabsConfig: IPrefabsConfig;
  private _tableConfig: ITableConfig[];
  private _tilesModelConfig: ITileModelsConfig[];
  constructor(params: {
    assetProvider: IAssetProvider;
    prefabsConfig: IPrefabsConfig;
    tableConfig: ITableConfig[];
    tilesModelConfig: ITileModelsConfig[];
  }) {
    const { assetProvider, prefabsConfig, tableConfig, tilesModelConfig } =
      params;

    this._assetProvider = assetProvider;
    this._prefabsConfig = prefabsConfig;
    this._tableConfig = tableConfig;
    this._tilesModelConfig = tilesModelConfig;
  }

  async loadAssets() {
    const prefabs = this._prefabsConfig.getAll();
    await Promise.all([
      ...prefabs.map((prefab) => this._assetProvider.loadAsset(prefab)),
      ...this._tilesModelConfig.map((tileModel) =>
        this._assetProvider.loadAsset(tileModel.path),
      ),
    ]);
  }

  createTableView(): TableView {
    try {
      const prefab = this.instantiateOnCanvas(
        this._prefabsConfig.tablePrefab,
        TableView,
      );
      return prefab;
    } catch (error) {
      cc.error("Failed to create table:", error);
    }
  }
  createUiPanelView(): UiPanelView {
    try {
      return this.instantiateOnCanvas(
        this._prefabsConfig.uIPanelPrefab,
        UiPanelView,
      );
    } catch (error) {
      cc.error("Failed to create UI panel:", error);
    }
  }
  createCurtain() {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const curtain: Curtain = this._assetProvider
        .instantiateAsset(this._prefabsConfig.curtainPrefab)
        .getComponent(Curtain);

      curtain.node.setParent(director);
      curtain.node.setPosition(0, 0);
      return curtain;
    } catch (error) {
      cc.error("Failed to create curtain:", error);
    }
  }
  createTableController(
    tableView: ITableView,
    tableModel: ITableModel,
    vfxFactory: IVfxFactory,
  ) {
    const tableController = new TableController(
      tableView,
      tableModel,
      vfxFactory,
    );
    return tableController;
  }
  createTableModel(tableCells: TableCell[][], tiles: ITile[][]): TableModel {
    const tableModel: TableModel = new TableModel(tableCells, tiles);
    return tableModel;
  }

  createTableCells(): TableCell[][] {
    const grid: TableCell[][] = [];
    const id = Math.floor(Math.random() * this._tableConfig.length);
    const tableConfig = this._tableConfig[id];
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
          startY - line * cellHeight,
        );
        const cell = new TableCell(col, line, pos, true);
        grid[col][line] = cell;
      }
    }
    return grid;
  }
  private instantiateOnCanvas<T extends cc.Component>(
    prefabPath: string,
    component: { new (): T },
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

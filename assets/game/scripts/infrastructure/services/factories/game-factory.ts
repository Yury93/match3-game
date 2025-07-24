import type { IService } from "../serviceLocator";
import { Curtain } from "../../../curtain/curtain";
import type {
  IPrefabsConfig,
  ITableConfig,
  ITileModelsConfig,
} from "../../../configs/config-types";
import type { IAssetProvider } from "../asset-provider";
import type { ITableView } from "../../../game-logic/table/table-view";
import { TableView } from "../../../game-logic/table/table-view";
import { TableCell } from "../../../game-logic/table-cell";
import type { ITile } from "../../../game-logic/tile";
import type { ITableModel } from "../../../game-logic/table/table-model";
import { TableModel } from "../../../game-logic/table/table-model";
import { UiPanelView } from "../../../game-logic/ui/ui-panel";
import { TableController } from "../../../game-logic/table/table-controller";

import type { IVfxFactory } from "./vfx-factory";
import { AbstractFactory } from "./abstract-factory";

export interface IGameFactory extends IService {
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
  loadAssets();
  cleanUp();
}

export class GameFactory extends AbstractFactory implements IGameFactory {
  private _prefabsConfig: IPrefabsConfig;
  private _tableConfig: ITableConfig[];
  private _tilesModelConfig: ITileModelsConfig[];
  constructor(params: {
    assetProvider: IAssetProvider;
    prefabsConfig: IPrefabsConfig;
    tableConfig: ITableConfig[];
    tilesModelConfig: ITileModelsConfig[];
  }) {
    super(params.assetProvider);
    const { assetProvider, prefabsConfig, tableConfig, tilesModelConfig } =
      params;

    this._assetProvider = assetProvider;
    this._prefabsConfig = prefabsConfig;
    this._tableConfig = tableConfig;
    this._tilesModelConfig = tilesModelConfig;
  }

  async loadAssets() {
    const paths = [
      ...this._prefabsConfig.getAll(),
      ...this._tilesModelConfig.map((tileModel) => tileModel.path),
    ];
    await this.handleAssets(paths, (path) =>
      this._assetProvider.loadAsset(path),
    );
  }

  createTableView(): TableView {
    try {
      const prefab = this.instantiateOnCanvas<TableView>(
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
      return this.instantiateOnCanvas<UiPanelView>(
        this._prefabsConfig.uIPanelPrefab,
        UiPanelView,
      );
    } catch (error) {
      cc.error("Failed to create UI panel:", error);
    }
  }
  createCurtain() {
    try {
      const director = cc.director.getScene().getChildByName("EntryPoint");
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
  async cleanUp() {
    const paths = [
      ...this._prefabsConfig.getAll(),
      ...this._tilesModelConfig.map((tileModel) => tileModel.path),
    ];
    await this.handleAssets(paths, (path) =>
      this._assetProvider.unloadAsset(path),
    );
  }
}

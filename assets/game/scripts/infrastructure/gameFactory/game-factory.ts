import { IService } from "../services/serviceLocator";
import { IAssetProvider } from "./asset-provider";
import { PREFABS, TABLE, TILE_MODELS } from "../../configs/configs";
import Tile, { TileType } from "../../game-logic/tiles/tile";
import { TableCell } from "../../game-logic/table/table-cell";
import Table from "../../game-logic/table/table";
import { TableModel } from "../../game-logic/table/table-model";

export interface IGameFactory extends IService {
  loadAssets();
  createTable(): Table;
  createTiles(cells: TableCell[][], tableContent: cc.Node): Tile[][];
  createTile(
    tileType: TileType,
    spriteFrame: cc.SpriteFrame,
    content: cc.Node,
    tileCell: TableCell
  );
  createTableCells(content: cc.Node): TableCell[][];
  createTableModel(tableCell: TableCell[][], tiles: Tile[][]): TableModel;
}

export class GameFactory implements IGameFactory {
  constructor(private _assetProvider: IAssetProvider) {}

  async loadAssets() {
    await this._assetProvider.loadAsset(PREFABS.tablePrefab);
    await this._assetProvider.loadAsset(PREFABS.tilePrefab);
    await Promise.all(
      TILE_MODELS.map((tileModel) =>
        this._assetProvider.loadAsset(tileModel.path)
      )
    );
  }

  createTable(): Table {
    try {
      const director = cc.director.getScene().getChildByName("Canvas");
      const table: Table = this._assetProvider
        .instantiateAsset(PREFABS.tablePrefab)
        .getComponent(Table);

      table.node.setParent(director);
      table.node.setPosition(0, 0);

      return table;
    } catch (error) {
      console.error("Failed to create table:", error);
    }
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
    console.log(" TEXTURE : " + texture);
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
    const startY = -((lines - 1) * cellHeight) / 2;

    for (let col = 0; col < columns; col++) {
      grid[col] = [];
      for (let line = 0; line < lines; line++) {
        const pos = new cc.Vec2(
          startX + col * cellWidth,
          startY + line * cellHeight
        );
        const cell = new TableCell(col, line, pos, true);
        grid[col][line] = cell;
      }
    }
    return grid;
  }
}

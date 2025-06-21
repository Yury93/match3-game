import { PREFABS, TILE_MODELS } from "../../../configs/configs";
import { TableCell } from "../../../logic/table-cell";
import Tile, { ITile } from "../../../logic/tile";
import { TileType } from "../../../logic/tile-type";
import { IService } from "../serviceLocator";
import { IAssetProvider } from "./asset-provider";

export interface ITileFactory extends IService {
  createTiles(cells: TableCell[][]): ITile[][];
  getRandomTileModel(): { tileType: TileType; sprite: cc.SpriteFrame };
  createTile(
    tileType: TileType,
    spriteFrame: cc.SpriteFrame,
    tileCell: TableCell
  ): ITile;
  createRandomTile(cell: TableCell): ITile;
}
export class TileFactory implements ITileFactory {
  constructor(private _assetProvider: IAssetProvider) {}

  createRandomTile(cell: TableCell): ITile {
    const tileModel = this.getRandomTileModel();
    const newTile = this.createTile(tileModel.tileType, tileModel.sprite, cell);
    return newTile;
  }
  createTiles(cells: TableCell[][]): ITile[][] {
    const tiles: ITile[][] = [];

    for (let col = 0; col < cells.length; col++) {
      tiles[col] = [];
      for (let row = 0; row < cells[col].length; row++) {
        const cell = cells[col][row];
        if (cell.isFree()) {
          const tileModel = this.getRandomTileModel();
          const tile = this.createTile(
            tileModel.tileType,
            tileModel.sprite,

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
    tileCell: TableCell
  ): Tile {
    try {
      const tile: Tile = this._assetProvider
        .instantiateAsset(PREFABS.tilePrefab)
        .getComponent(Tile);

      tile.node.setPosition(tileCell.getPosition());

      tile.Init(tileType, spriteFrame);
      return tile;
    } catch (error) {
      console.error("Failed to create table:", error);
    }
  }
}

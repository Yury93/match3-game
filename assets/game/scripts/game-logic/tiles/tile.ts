const { ccclass, property } = cc._decorator;
export const TILE_CLICK_EVENT = "TileClicked";

export enum TileType {
  BLUE = "blue",
  RED = "red",
  GREEN = "green",
  PURPLE = "purple",
  YELLOW = "yellow",
}
@ccclass
export default class Tile extends cc.Component implements ITile {
  @property
  tileType: TileType = TileType.BLUE;
  @property(cc.Sprite)
  sprite: cc.Sprite = null;

  Init(TileType: TileType, spriteFrame: cc.SpriteFrame) {
    this.tileType = TileType;
    this.sprite.spriteFrame = spriteFrame;
  }
  public onTileClick() {
    this.sprite.node.emit(TILE_CLICK_EVENT, this);
  }
}

export interface ITile {
  tileType: TileType;
  sprite: cc.Sprite;
}

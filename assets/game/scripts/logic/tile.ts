import { TileType } from "./tile-type";

const { ccclass, property } = cc._decorator;

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
}

export interface ITile {
  tileType: TileType;
  sprite: cc.Sprite;
}

import { TileType } from "./tile-type";

const { ccclass, property } = cc._decorator;

@ccclass
export class Tile extends cc.Component implements ITile {
  @property
  tileType: TileType = TileType.BLUE;
  @property(cc.Sprite)
  sprite: cc.Sprite = null;
  @property(cc.Sprite)
  highlight: cc.Sprite = null;
  nodeTile: cc.Node = null;
  touchHandler: (tile: ITile) => void;

  Init(TileType: TileType, spriteFrame: cc.SpriteFrame) {
    this.nodeTile = this.node;
    this.tileType = TileType;
    this.sprite.spriteFrame = spriteFrame;
  }

  protected onDestroy(): void {
    console.log("destroy ", `${this.nodeTile} ${this.tileType} ${this.sprite}`);
  }
  addListener(callback: (tile: ITile) => void) {
    this.touchHandler = callback;
    this.sprite.node.on(cc.Node.EventType.TOUCH_END, this.touchHandler, this);
  }
  removeListener() {
    if (this.touchHandler === null || this.touchHandler === undefined) {
      throw new Error("no touch handler");
    }
    this.sprite.node.off(cc.Node.EventType.TOUCH_END, this.touchHandler, this);
  }
  setActiveHightlight(active: boolean) {
    if (this.highlight.node) this.highlight.node.active = active;
    else throw new Error("no highlight node");
  }
  destroyTile() {
    this.destroy();
  }
}
export interface ITile {
  tileType: TileType;
  sprite: cc.Sprite;
  nodeTile: cc.Node;
  touchHandler: (tile: ITile) => void;
  Init(tileType: TileType, spriteFrame: cc.SpriteFrame);
  addListener(callback: (tile: ITile) => void);
  removeListener();
  destroyTile();
  setActiveHightlight(active: boolean);
}

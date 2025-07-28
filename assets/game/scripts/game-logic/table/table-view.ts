import type { ISheduler } from "../../infrastructure/isheduler";
import type { TableCell } from "../table-cell";
import type { ITile } from "../tile";

export interface ITableView {
  swapTile(tile: ITile, pos: cc.Vec2);
  nodeView: cc.Node;
  getContent(): cc.Node;
  showFalseBurnMessage(tile: ITile);
  addTile(tile: ITile, tableCell: TableCell, startPosition: cc.Vec2);
  removeTile(tile: ITile);
  moveTile(tile: ITile, newPos: cc.Vec2, speed?: number, _easing?: string);
}

const { ccclass, property } = cc._decorator;

@ccclass
export class TableView extends cc.Component implements ITableView, ISheduler {
  @property(cc.Node)
  content: cc.Node = null;
  nodeView: cc.Node = null;
  protected onLoad(): void {
    this.nodeView = this.node;
  }

  getContent(): cc.Node {
    return this.content;
  }
  showFalseBurnMessage(tile: ITile) {
    const node = tile.nodeTile;

    const pulseAction = cc.sequence(
      cc.scaleTo(0.1, 1.2),
      cc.scaleTo(0.1, 0.9),
      cc.scaleTo(0.1, 1.1),
      cc.scaleTo(0.1, 1.0),
    );

    node.runAction(pulseAction);
  }
  addTile(tile: ITile, tableCell: TableCell, startPosition: cc.Vec2) {
    tile.nodeTile.setParent(this.content);
    tile.nodeTile.setPosition(startPosition);
  }
  removeTile(tile: ITile) {
    cc.tween(tile.sprite.node)
      .parallel(
        cc.tween().to(0.2, { scale: 0 }, { easing: "backIn" }),
        cc.tween().to(0.2, { angle: 360 }, { easing: "quadIn" }),
        cc.tween().to(0.2, { opacity: 0 }, { easing: "quadIn" }),
      )
      .call(() => {
        tile.destroyTile();
      })
      .start();
  }
  moveTile(tile: ITile, newPos: cc.Vec2) {
    const pos3 = new cc.Vec3(newPos.x, newPos.y, 0);
    cc.tween(tile.nodeTile)
      .to(0.8, { position: pos3 }, { easing: "bounceOut" })
      .start();
  }
  swapTile(tile: ITile, pos: cc.Vec2) {
    const targetPos = new cc.Vec3(pos.x, pos.y, 0);
    const startPos = tile.nodeTile.position;
    const midPoint = cc.v3(
      (startPos.x + targetPos.x) / 2,
      (startPos.y + targetPos.y) / 2 + 30,
      0,
    );

    const originalZIndex = tile.nodeTile.zIndex;
    tile.nodeTile.zIndex = 9999;

    cc.tween(tile.nodeTile)
      .to(0.3, { position: midPoint, scale: 1.5 }, { easing: "quadOut" })
      .to(0.4, { position: targetPos, scale: 1 }, { easing: "quadIn" })
      .call(() => {
        tile.nodeTile.zIndex = originalZIndex;
      })
      .start();
  }
}

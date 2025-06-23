import { TableCell } from "../table-cell";
import { ITile } from "../tile";

export interface ITableView {
  nodeView: cc.Node;
  getContent(): cc.Node;
  showFalseBurnMessage(tile: ITile);
  addTile(tile: ITile, tableCell: TableCell);
  explosion(tile: ITile);
  removeTile(tile: ITile);
  moveTile(tile: ITile, newPos: cc.Vec2);
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableView extends cc.Component implements ITableView {
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
      cc.scaleTo(0.1, 1.0)
    );

    node.runAction(pulseAction);
  }
  addTile(tile: ITile, tableCell: TableCell) {
    tile.nodeTile.setParent(this.content);
    tile.nodeTile.setPosition(tableCell.getPosition());
    tile.nodeTile.scale = 0;
    tile.nodeTile.angle = 0;
    cc.tween(tile.nodeTile)
      .delay(0.2)
      .to(0.3, { scale: 1 }, { easing: "backOut" })
      .call(() => {
        cc.tween(tile.nodeTile)
          .to(0.2, { angle: -12 }, { easing: "sineInOut" })
          .start();
      })
      .start();
  }
  explosion(tile: ITile) {
    cc.tween(tile.nodeTile)
      .to(0.1, { scale: 0 }, { easing: "backIn" })
      .call(() => {
        tile.destroyTile();
      })
      .start();
  }
  removeTile(tile: ITile) {
    cc.tween(tile.sprite.node)
      .to(0.1, { scale: 0 }, { easing: "backIn" })
      .call(() => {
        tile.destroyTile();
      })
      .start();
  }
  moveTile(tile: ITile, newPos: cc.Vec2) {
    cc.tween(tile.nodeTile)
      .to(
        0.3,
        {
          x: newPos.x,
          y: newPos.y,
        },
        { easing: "quadOut" }
      )
      .start();
  }
}

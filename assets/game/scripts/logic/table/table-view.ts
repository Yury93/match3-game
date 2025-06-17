import { TableCell } from "../table-cell";
import Tile from "../tile";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableView extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;

  getContent(): cc.Node {
    return this.content;
  }
  addTile(tile: Tile, tableCell: TableCell) {
    tile.node.setParent(this.content);
    tile.node.setPosition(tableCell.getPosition());
    tile.node.scale = 0;
    tile.node.angle = 0;
    cc.tween(tile.node)
      .delay(0.2)
      .to(0.3, { scale: 1 }, { easing: "backOut" })
      .call(() => {
        cc.tween(tile.node)
          .to(0.2, { angle: -12 }, { easing: "sineInOut" })
          .start();
      })
      .start();
  }
  explosion(tile: Tile) {
    cc.tween(tile.node)
      .to(0.1, { scale: 0 }, { easing: "backIn" })
      .call(() => {
        tile.node.destroy();
      })
      .start();
  }
  removeTile(tile: Tile) {
    cc.tween(tile.node)
      .to(0.1, { scale: 0 }, { easing: "backIn" })
      .call(() => {
        tile.node.destroy();
      })
      .start();
  }

  moveTile(tile: Tile, newPos: cc.Vec2) {
    cc.tween(tile.node).to(0.3, { y: newPos.y }, { easing: "quadOut" }).start();
  }
}

import { TableCell as TableCell } from "./table-cell";
import { TableModel } from "./table-model";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Table extends cc.Component {
  @property(cc.Node)
  content: cc.Node = null;
  private _tableModel: TableModel;
  getTableModel() {
    return this._tableModel;
  }
  getContent(): cc.Node {
    return this.content;
  }

  Init(tableModel: TableModel) {
    this._tableModel = tableModel;
  }
}

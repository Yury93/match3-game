import { ITableController } from "../table/table-controller";
import { ITableModel } from "../table/table-model";
import { ITile } from "../tile";

export interface IGameMechanic {
  init(tableController: ITableController, tableModel: ITableModel);
  onTurnEnd(): void;
  onTileClick(tile: ITile): boolean;
}

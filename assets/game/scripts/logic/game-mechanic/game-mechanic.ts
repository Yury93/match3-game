import { ITableController } from "../table/table-controller";
import { ITableModel } from "../table/table-model";
import { ITile } from "../tile";
import { MechanicType } from "./mechanic-types";

export interface IGameMechanic {
  mechanicType: MechanicType;
  init(tableController: ITableController, tableModel: ITableModel);
  onTurnEnd(): void;
  onTileClick(tile: ITile): boolean;
  dispatchUseMechanicEvent(mechanicType: MechanicType, data: any);
}

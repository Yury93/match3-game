import type { ITableController } from "../table/table-controller";
import type { ITableModel } from "../table/table-model";
import type { ITile } from "../tile";

import type { MechanicType } from "./mechanic-types";

export interface IGameMechanic {
  mechanicType: MechanicType;
  init(tableController: ITableController, tableModel: ITableModel);
  onTurnEnd(): void;
  onTileClick(tile: ITile): boolean;
  dispatchUseMechanicEvent(mechanicType: MechanicType, data: unknown);
}

import type { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import type {
  ITableController,
  TableController,
} from "../table/table-controller";
import type { ITableModel, TableModel } from "../table/table-model";
import type { ITile } from "../tile";

import { BasicMechanic } from "./basic-mechanic";
import { BoosterBombMechanic as BombBoosterMechanic } from "./booster-bomb-mechanic";
import type { IGameMechanic } from "./game-mechanic";
import { TeleportBoosterMechanic } from "./teleport-booster-mechanic";

export interface IMechanicController {
  onClickTile: (tile: ITile) => void;
  initMechanics(
    tableController: TableController,
    tableModel: TableModel,
    mechanic: IGameMechanic[],
  );
  getActiveMechanic(): IGameMechanic | null;
  setActiveMechanic(mechanic: IGameMechanic);
  getMechanicByType(type: Function): IGameMechanic | undefined;
  onTileClick(tile: ITile);
  onTurnEnd();
  removeListeners();
}
export class MechanicController implements IMechanicController {
  private _mechanics: IGameMechanic[] = [];
  private _activeMechanic: IGameMechanic | null = null;
  onClickTile: (tile: ITile) => void;
  constructor(
    tileFactory: ITileFactory,
    tableController: ITableController,
    tableModel: ITableModel,
  ) {
    this.initMechanics(tableController, tableModel, [
      new BasicMechanic(tileFactory),
      new BombBoosterMechanic(tileFactory),
      new TeleportBoosterMechanic(tileFactory),
    ]);
  }

  initMechanics(
    tableController: ITableController,
    tableModel: ITableModel,
    mechanics: IGameMechanic[],
  ) {
    this._mechanics = mechanics;
    mechanics.forEach((m) => m.init(tableController, tableModel));
    try {
      this.setActiveMechanic(this.getMechanicByType(BasicMechanic));
    } catch (e) {
      throw e;
    }
  }
  setActiveMechanic(mechanic: IGameMechanic) {
    console.log("set active mechanic : ", mechanic);
    this._activeMechanic = mechanic;
  }
  getActiveMechanic(): IGameMechanic | null {
    return this._activeMechanic;
  }
  getMechanicByType(type: Function): IGameMechanic | undefined {
    return this._mechanics.find((m) => m instanceof type);
  }
  onTileClick(tile: ITile) {
    if (!this._activeMechanic) return;
    if (this.onClickTile) this.onClickTile(tile);
    const shouldReset = this._activeMechanic.onTileClick(tile);
    if (shouldReset && !(this._activeMechanic instanceof BasicMechanic)) {
      this.setActiveMechanic(this.getMechanicByType(BasicMechanic));
    }
  }
  removeListeners() {
    this.onClickTile = null;
  }
  onTurnEnd() {
    for (const mechanic of this._mechanics) {
      if (mechanic.onTurnEnd) {
        mechanic.onTurnEnd();
      }
    }
  }
}

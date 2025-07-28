import type { IConstantsConfig } from "../../configs/config-types";
import type { ISheduler } from "../../infrastructure/isheduler";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
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
    sheulder: ISheduler,
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
    sheulder: ISheduler,
    tileFactory: ITileFactory,
    tableController: ITableController,
    tableModel: ITableModel,
    constantsConfig: IConstantsConfig,
  ) {
    this.initMechanics(sheulder, tableController, tableModel, [
      new BasicMechanic(tileFactory, sheulder),
      new BombBoosterMechanic(tileFactory, constantsConfig, sheulder),
      new TeleportBoosterMechanic(tileFactory, sheulder),
    ]);
  }

  initMechanics(
    sheulder: ISheduler,
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
    cc.log("set active mechanic : ", mechanic);
    this._activeMechanic = mechanic;
  }
  getActiveMechanic(): IGameMechanic | null {
    return this._activeMechanic;
  }
  getMechanicByType(type: Function): IGameMechanic | undefined {
    return this._mechanics.find((m) => m instanceof type);
  }
  async onTileClick(tile: ITile) {
    if (!this._activeMechanic) return;
    if (this.onClickTile) this.onClickTile(tile);
    const shouldReset = await this._activeMechanic.onTileClick(tile);
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

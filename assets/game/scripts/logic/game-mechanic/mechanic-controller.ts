import { BasicMechanic } from "./basic-mechanic";
import { BoosterBombMechanic } from "./booster-bomb-mechanic";
import { IGameMechanic } from "./game-mechanic";
import { ITableController, TableController } from "../table/table-controller";
import { ITableModel, TableModel } from "../table/table-model";
import { ITile } from "../tile";
import { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";

export interface IMechanicController {
  initMechanics(
    tableController: TableController,
    tableModel: TableModel,
    mechanic: IGameMechanic[]
  );
  getActiveMechanic(): IGameMechanic | null;
  setActiveMechanic(mechanic: IGameMechanic);
  getMechanicByType(type: Function): IGameMechanic | undefined;
  onTileClick(tile: ITile);
  onTurnEnd();
}

export class MechanicController implements IMechanicController {
  private _mechanics: IGameMechanic[] = [];
  private _activeMechanic: IGameMechanic | null = null;

  constructor(
    tileFactory: ITileFactory,
    tableController: ITableController,
    tableModel: ITableModel
  ) {
    this.initMechanics(tableController, tableModel, [
      new BasicMechanic(tileFactory),
      new BoosterBombMechanic(tileFactory),
    ]);
  }

  initMechanics(
    tableController: ITableController,
    tableModel: ITableModel,
    mechanics: IGameMechanic[]
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
    this._activeMechanic = mechanic;
  }
  getActiveMechanic(): IGameMechanic | null {
    return this._activeMechanic;
  }
  getMechanicByType(type: Function): IGameMechanic | undefined {
    return this._mechanics.find((m) => m instanceof type);
  }
  onTileClick(tile: ITile) {
    if (this._activeMechanic && this._activeMechanic.onTileClick) {
      this._activeMechanic.onTileClick(tile);
      if (!(this._activeMechanic instanceof BasicMechanic)) {
        this.setActiveMechanic(this.getMechanicByType(BasicMechanic));
      }
    }
  }

  onTurnEnd() {
    for (const mechanic of this._mechanics) {
      if (mechanic.onTurnEnd) {
        mechanic.onTurnEnd();
      }
    }
  }
}

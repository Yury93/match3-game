import { BasicMechanic } from "../../logic/game-mechanic/basic-mechanic";
import { IGameMechanic } from "../../logic/game-mechanic/game-mechanic";
import { TableController } from "../../logic/table/table-controller";
import { ITile } from "../../logic/tile";
import { IGameFactory } from "./gameFactory/game-factory";
import { IService } from "./serviceLocator";

export interface IMechanicService extends IService {
  init(mechanics: IGameMechanic[]);
  setActiveMechanic(mechanic: IGameMechanic);
  activeMechanic(): IGameMechanic | null;
  getMechanicByType(type: Function): IGameMechanic | undefined;
  onTileClick(tile: ITile, tableController: TableController);
  onTurnEnd(tableController: TableController);
}

export class MechanicService implements IMechanicService {
  private _mechanics: IGameMechanic[] = [];
  private _activeMechanic: IGameMechanic | null = null;
  constructor(private _gameFactory: IGameFactory) {}

  init(mechanics: IGameMechanic[]) {
    this._mechanics = mechanics;
  }
  setActiveMechanic(mechanic: IGameMechanic) {
    this._activeMechanic = mechanic;
  }
  activeMechanic(): IGameMechanic | null {
    return this._activeMechanic;
  }
  getMechanicByType(type: Function): IGameMechanic | undefined {
    return this._mechanics.find((m) => m instanceof type);
  }
  onTileClick(tile: ITile, tableController: TableController) {
    if (this._activeMechanic && this._activeMechanic.onTileClick) {
      this._activeMechanic.onTileClick(tile, tableController);
      if (!(this._activeMechanic instanceof BasicMechanic)) {
        this.setActiveMechanic(this.getMechanicByType(BasicMechanic));
      }
    }
  }

  onTurnEnd(tableController: TableController) {
    for (const mechanic of this._mechanics) {
      if (mechanic.onTurnEnd) {
        mechanic.onTurnEnd();
      }
    }
  }
}

import { ISheduler } from "../../infrastructure/isheduler";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
import type { ITableController } from "../table/table-controller";
import type { ITableModel } from "../table/table-model";
import type { ITile } from "../tile";

import type { IGameMechanic } from "./game-mechanic";
import {
  MechanicEventSystem,
  MechanicEventType,
} from "./mechanic-event-system";
import { MechanicType } from "./mechanic-types";

export abstract class AbstractMechanic implements IGameMechanic {
  protected _tableController: ITableController;
  protected _tableModel: ITableModel;
  private _fillEmptyDelay = 200;
  mechanicType: MechanicType = MechanicType.Basic;

  constructor(
    private _tileFactory: ITileFactory,
    protected _sheduler: ISheduler,
  ) {}

  init(tableController: ITableController, tableModel: ITableModel) {
    this._tableController = tableController;
    this._tableModel = tableModel;
  }
  onTurnEnd(): void {
    throw new Error("Method not implemented.");
  }
  async onTileClick(tile: ITile): Promise<boolean> {
    cc.log("click ", tile);
    return await new Promise<boolean>((resolve) => resolve(false));
  }
  protected async dropTiles(): Promise<void> {
    await new Promise<void>((resolve) => {
      const { columns, rows } = this._tableModel.getTileCount();
      for (let col = 0; col < columns; col++) {
        for (let row = rows - 1; row >= 0; row--) {
          if (!this._tableModel.getTile(col, row)) {
            for (let k = row - 1; k >= 0; k--) {
              const tileTarget = this._tableModel.getTile(col, k);
              if (tileTarget) {
                this._tableModel.setTile(col, row, tileTarget);
                this._tableModel.setTile(col, k, null);
                this._tableModel.onDropTileAction(
                  tileTarget,
                  this._tableModel.getCell(col, row).getPosition(),
                );
                this._tableModel.getCell(col, row).setFree(false);
                this._tableModel.getCell(col, k).setFree(true);
                resolve();
                break;
              }
            }
          }
        }
      }
      resolve();
    });
  }

  protected async fillEmpty(): Promise<void> {
    await this.delay(this._fillEmptyDelay);
    const { columns, rows } = this._tableModel.getTileCount();
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        if (!this._tableModel.getTile(col, row)) {
          const cell = this._tableModel.getCell(col, row);
          const newTile = this._tileFactory.createRandomTile(cell);
          this._tableModel.setTile(col, row, newTile);
          cell.setFree(false);
          this._tableModel.onAddTile(newTile, cell);
        }
      }
    }
  }
  dispatchUseMechanicEvent() {
    MechanicEventSystem.dispatch({
      type: MechanicEventType.MECHANIC_USED,
      mechanic: this,
      mechanicType: this.mechanicType,
    });
  }
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

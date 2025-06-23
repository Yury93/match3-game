import { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import { ITableController } from "../table/table-controller";
import { ITableModel } from "../table/table-model";
import { ITile } from "../tile";
import { IGameMechanic } from "./game-mechanic";
import {
  MechanicEventSystem,
  MechanicEventType,
} from "./mechanic-event-system";
import { MechanicType } from "./mechanic-types";

export abstract class AbstractMechanic implements IGameMechanic {
  protected tableController: ITableController;
  protected tableModel: ITableModel;
  mechanicType: MechanicType = MechanicType.Basic;

  constructor(private tileFactory: ITileFactory) {}

  init(tableController: ITableController, tableModel: ITableModel) {
    this.tableController = tableController;
    this.tableModel = tableModel;
  }
  onTurnEnd(): void {
    throw new Error("Method not implemented.");
  }
  onTileClick(tile: ITile): boolean {
    throw new Error("Method not implemented.");
  }
  protected dropTiles() {
    const { columns, rows } = this.tableModel.getTileCount();
    for (let col = 0; col < columns; col++) {
      for (let row = rows - 1; row >= 0; row--) {
        if (!this.tableModel.getTile(col, row)) {
          for (let k = row - 1; k >= 0; k--) {
            const tileTarget = this.tableModel.getTile(col, k);
            if (tileTarget) {
              this.tableModel.setTile(col, row, tileTarget);
              this.tableModel.setTile(col, k, null);
              this.tableModel.onMoveTileAction(
                tileTarget,
                this.tableModel.getCell(col, row).getPosition()
              );
              this.tableModel.getCell(col, row).setFree(false);
              this.tableModel.getCell(col, k).setFree(true);
              break;
            }
          }
        }
      }
    }
  }

  protected fillEmpty() {
    const { columns, rows } = this.tableModel.getTileCount();
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        if (!this.tableModel.getTile(col, row)) {
          const cell = this.tableModel.getCell(col, row);
          const newTile = this.tileFactory.createRandomTile(cell);
          this.tableModel.setTile(col, row, newTile);
          cell.setFree(false);
          this.tableModel.onAddTile(newTile, cell);
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
}

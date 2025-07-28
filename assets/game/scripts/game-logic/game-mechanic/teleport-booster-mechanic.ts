import type { ISheduler } from "../../infrastructure/isheduler";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-mechanic";
import { MechanicType } from "./mechanic-types";

export class TeleportBoosterMechanic extends AbstractMechanic {
  private firstSelectedTile: ITile | null = null;

  constructor(tileFactory: ITileFactory, sheduler: ISheduler) {
    super(tileFactory, sheduler);
    this.mechanicType = MechanicType.TeleportBoster;
  }

  async onTileClick(tile: ITile): Promise<boolean> {
    if (!this.firstSelectedTile || !this.firstSelectedTile.nodeTile) {
      this.firstSelectedTile = tile;

      this._tableController.onSelectTile(tile);
      return false;
    }

    if (this.firstSelectedTile === tile) {
      this._tableController.onDeselectTile(tile);
      this.firstSelectedTile = null;
      return false;
    }
    const pos1 = this._tableModel.getTilePosition(this.firstSelectedTile);
    const pos2 = this._tableModel.getTilePosition(tile);

    if (!pos1 || !pos2) return false;

    this.swapTiles(pos1, pos2);
    if (this.firstSelectedTile && this.firstSelectedTile.nodeTile) {
      this._tableController.onDeselectTile(this.firstSelectedTile);
    }
    this.firstSelectedTile = null;
    this._tableController.onSwap(tile);
    return true;
  }

  private swapTiles(
    pos1: { col: number; row: number },
    pos2: { col: number; row: number },
  ) {
    const tile1 = this._tableModel.getTile(pos1.col, pos1.row);
    const tile2 = this._tableModel.getTile(pos2.col, pos2.row);

    if (!tile1 || !tile2) return;

    this._tableModel.setTile(pos1.col, pos1.row, tile2);
    this._tableModel.setTile(pos2.col, pos2.row, tile1);

    const cell1 = this._tableModel.getCell(pos1.col, pos1.row);
    const cell2 = this._tableModel.getCell(pos2.col, pos2.row);

    this._tableModel.onSwapTile(tile1, cell2.getPosition());
    this._tableModel.onSwapTile(tile2, cell1.getPosition());
    this.dispatchUseMechanicEvent();
    this.onTurnEnd();
  }

  onTurnEnd(): void {
    if (this.firstSelectedTile) {
      this._tableController.onDeselectTile(this.firstSelectedTile);
      this.firstSelectedTile = null;
    }
    this._tableController.onTurnEnd();
  }
}

import type { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-machanic";
import { MechanicType } from "./mechanic-types";

export class TeleportBoosterMechanic extends AbstractMechanic {
  private firstSelectedTile: ITile | null = null;

  constructor(tileFactory: ITileFactory) {
    super(tileFactory);
    this.mechanicType = MechanicType.TeleportBoster;
  }

  onTileClick(tile: ITile): boolean {
    if (!this.firstSelectedTile || !this.firstSelectedTile.nodeTile) {
      this.firstSelectedTile = tile;

      this.tableController.onSelectTile(tile);
      return false;
    }

    if (this.firstSelectedTile === tile) {
      this.tableController.onDeselectTile(tile);
      this.firstSelectedTile = null;
      return false;
    }
    const pos1 = this.tableModel.getTilePosition(this.firstSelectedTile);
    const pos2 = this.tableModel.getTilePosition(tile);

    if (!pos1 || !pos2) return false;

    this.swapTiles(pos1, pos2);
    if (this.firstSelectedTile && this.firstSelectedTile.nodeTile) {
      this.tableController.onDeselectTile(this.firstSelectedTile);
    }
    this.firstSelectedTile = null;
    this.tableController.onSwap(tile);
    return true;
  }

  private swapTiles(
    pos1: { col: number; row: number },
    pos2: { col: number; row: number },
  ) {
    const tile1 = this.tableModel.getTile(pos1.col, pos1.row);
    const tile2 = this.tableModel.getTile(pos2.col, pos2.row);

    if (!tile1 || !tile2) return;

    this.tableModel.setTile(pos1.col, pos1.row, tile2);
    this.tableModel.setTile(pos2.col, pos2.row, tile1);

    const cell1 = this.tableModel.getCell(pos1.col, pos1.row);
    const cell2 = this.tableModel.getCell(pos2.col, pos2.row);

    this.tableModel.onMoveTileAction(tile1, cell2.getPosition());
    this.tableModel.onMoveTileAction(tile2, cell1.getPosition());
    this.dispatchUseMechanicEvent();
    this.onTurnEnd();
  }

  onTurnEnd(): void {
    if (this.firstSelectedTile) {
      this.tableController.onDeselectTile(this.firstSelectedTile);
      this.firstSelectedTile = null;
    }
    this.tableController.onTurnEnd();
  }
}

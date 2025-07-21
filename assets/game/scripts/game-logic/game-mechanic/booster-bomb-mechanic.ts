import type { IConstantsConfig } from "../../configs/config-types";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-mechanic";
import { MechanicType } from "./mechanic-types";

export class BoosterBombMechanic extends AbstractMechanic {
  private readonly RADIUS: number;
  constructor(tileFactory: ITileFactory, constantsConfig: IConstantsConfig) {
    super(tileFactory);
    this.RADIUS = constantsConfig.boosterBombR;
    this.mechanicType = MechanicType.BombBoster;
  }

  onTileClick(tile: ITile): boolean {
    this.tableController.onBombAction(tile);
    const { col, row } = this.tableModel.getTilePosition(tile as ITile);
    if (col < 0 || row < 0) return false;

    const { columns, rows } = this.tableModel.getTileCount();
    const tilesToBurn: ITile[] = [];

    for (let dx = -this.RADIUS; dx <= this.RADIUS; dx++) {
      for (let dy = -this.RADIUS; dy <= this.RADIUS; dy++) {
        const c = col + dx;
        const r = row + dy;
        if (c >= 0 && c < columns && r >= 0 && r < rows) {
          const t = this.tableModel.getTile(c, r);
          if (t) {
            tilesToBurn.push(t);
          }
        }
      }
    }

    if (tilesToBurn.length === 0) return false;
    this.tableController.beforeBombAction(tile, tilesToBurn.length);
    tilesToBurn.forEach((t) => {
      const pos = this.tableModel.getTilePosition(t);
      this.tableController.onClearTile(t);
      this.tableModel.setTile(pos.col, pos.row, null);
      this.tableModel.getCell(pos.col, pos.row).setFree(true);
    });

    this.dropTiles();
    this.fillEmpty();

    if (this.tableController.onBurnAction) {
      this.tableController.onBurnAction(tilesToBurn.length);
    }

    this.dispatchUseMechanicEvent();
    this.onTurnEnd();
    return true;
  }

  onTurnEnd(): void {
    this.tableController.onTurnEnd();
  }
}

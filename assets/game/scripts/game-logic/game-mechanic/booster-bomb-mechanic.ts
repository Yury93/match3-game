import type { IConstantsConfig } from "../../configs/config-types";
import { ISheduler } from "../../infrastructure/isheduler";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-mechanic";
import { MechanicType } from "./mechanic-types";

export class BoosterBombMechanic extends AbstractMechanic {
  private readonly RADIUS: number;
  constructor(
    tileFactory: ITileFactory,
    constantsConfig: IConstantsConfig,
    sheduler: ISheduler,
  ) {
    super(tileFactory, sheduler);
    this.RADIUS = constantsConfig.boosterBombR;
    this.mechanicType = MechanicType.BombBoster;
  }

  async onTileClick(tile: ITile): Promise<boolean> {
    this._tableController.onBombAction(tile);
    const { col, row } = this._tableModel.getTilePosition(tile as ITile);
    if (col < 0 || row < 0) return false;

    const { columns, rows } = this._tableModel.getTileCount();
    const tilesToBurn: ITile[] = [];

    for (let dx = -this.RADIUS; dx <= this.RADIUS; dx++) {
      for (let dy = -this.RADIUS; dy <= this.RADIUS; dy++) {
        const c = col + dx;
        const r = row + dy;
        if (c >= 0 && c < columns && r >= 0 && r < rows) {
          const t = this._tableModel.getTile(c, r);
          if (t) {
            tilesToBurn.push(t);
          }
        }
      }
    }

    if (tilesToBurn.length === 0) return false;
    this._tableController.beforeBombAction(tile, tilesToBurn.length);
    tilesToBurn.forEach((t) => {
      const pos = this._tableModel.getTilePosition(t);
      this._tableController.onClearTile(t);
      this._tableModel.setTile(pos.col, pos.row, null);
      this._tableModel.getCell(pos.col, pos.row).setFree(true);
    });

    await this.dropTiles();
    await this.fillEmpty();

    if (this._tableController.onBurnAction) {
      this._tableController.onBurnAction(tilesToBurn.length);
    }

    this.dispatchUseMechanicEvent();
    this.onTurnEnd();
    return true;
  }

  onTurnEnd(): void {
    this._tableController.onTurnEnd();
  }
}

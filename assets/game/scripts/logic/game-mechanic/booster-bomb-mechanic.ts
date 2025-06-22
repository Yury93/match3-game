import { CONSTANTS } from "../../configs/configs";
import { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import { ITile } from "../tile";
import { AbstractMechanic } from "./abstract-machanic";
import { MechanicType } from "./mechanic-types";

export class BoosterBombMechanic extends AbstractMechanic {
  private readonly RADIUS = CONSTANTS.boosterBombR;
  constructor(tileFactory: ITileFactory) {
    super(tileFactory);
    this.mechanicType = MechanicType.BombBoster;
  }
  onTurnEnd(): void {}

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

    tilesToBurn.forEach((t) => {
      const pos = this.tableModel.getTilePosition(t);
      this.tableController.onClearTile(t);
      this.tableModel.setTile(pos.col, pos.row, null);
      this.tableModel.getCell(pos.col, pos.row).setFree(true);
    });

    this.dropTiles();
    this.fillEmpty();

    if (this.tableController.onBurnAction)
      this.tableController.onBurnAction(tilesToBurn.length);

    this.dispatchUseMechanicEvent();

    return true;
  }
}

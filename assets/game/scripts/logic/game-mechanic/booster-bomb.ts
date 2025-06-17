import { CONSTANTS } from "../../configs/configs";
import { IGameFactory } from "../../infrastructure/services/gameFactory/game-factory";
import { ITile } from "../tile";
import { AbstractMechanic } from "./abstract-machanic";

export class BoosterBomb extends AbstractMechanic {
  private readonly RADIUS = CONSTANTS.boosterBombR;
  constructor(private _gameFactory: IGameFactory) {
    super();
  }
  onTurnEnd(): void {}

  onTileClick(tile: ITile, tableController: any): boolean {
    this.playEffectExplosion(tile);

    const { col, row } = tableController.getTilePosition(tile as ITile);
    if (col < 0 || row < 0) return false;

    const { columns, rows } = tableController.getTileCount();
    const tilesToBurn: ITile[] = [];

    for (let dx = -this.RADIUS; dx <= this.RADIUS; dx++) {
      for (let dy = -this.RADIUS; dy <= this.RADIUS; dy++) {
        const c = col + dx;
        const r = row + dy;
        if (c >= 0 && c < columns && r >= 0 && r < rows) {
          const t = tableController.getTile(c, r);
          if (t) {
            tilesToBurn.push(t);
          }
        }
      }
    }

    if (tilesToBurn.length === 0) return false;

    tilesToBurn.forEach((t) => {
      const pos = tableController.getTilePosition(t);
      tableController.removeTile(t);
      tableController.setTile(pos.col, pos.row, null);
      tableController.getCell(pos.col, pos.row).setFree(true);
    });

    this.dropTiles(tableController);
    this.fillEmpty(tableController);

    if (tableController.onBurn) tableController.onBurn(tilesToBurn.length);

    return true;
  }
  playEffectExplosion(tile: ITile) {
    const explosion = this._gameFactory
      .createBombEffect(tile.sprite.node)
      .getComponent(cc.Sprite);
    explosion.node.active = true;
    explosion.node.opacity = 0;
    cc.tween(explosion.node)
      .to(0.3, { opacity: 255 }, { easing: "sine.out" })
      .call(() => {
        // const particle = explosion.node.children[0].getComponent(
        //   cc.ParticleSystem
        // );
        // particle.active = true;
        // particle;
      })
      .delay(1)
      .to(0.3, { opacity: 0 }, { easing: "sine.in" })
      .delay(0.3)
      .call(() => {
        explosion.destroy();
      })
      .start();
  }
}

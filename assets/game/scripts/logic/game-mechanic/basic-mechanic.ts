import Tile, { ITile } from "../tile";
import { AbstractMechanic } from "./abstract-machanic";

export class BasicMechanic extends AbstractMechanic {
  onTileClick(tile: ITile, tableController): boolean {
    const group = this.findConnectedTiles(tile as Tile, tableController);
    if (group.length < 2) return false;

    this.burnTiles(group, tableController);
    this.dropTiles(tableController);
    this.fillEmpty(tableController);

    if (tableController.onBurn) tableController.onBurn(group.length);
    return true;
  }
  onTurnEnd(): void {}

  private findConnectedTiles(startTile: Tile, tableController): Tile[] {
    const { columns, rows } = tableController.getTileCount();
    const visited = new Set<Tile>();
    const stack: Tile[] = [startTile];
    const type = startTile.tileType;
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    while (stack.length > 0) {
      const tile = stack.pop();
      if (!tile || visited.has(tile)) continue;
      if (tile.tileType !== type) continue;
      visited.add(tile);

      const { col, row } = tableController.getTilePosition(tile);
      for (let i = 0; i < directions.length; i++) {
        const [dc, dr] = directions[i];
        const nc = col + dc;
        const nr = row + dr;
        if (nc >= 0 && nc < columns && nr >= 0 && nr < rows) {
          const neighbor = tableController.getTile(nc, nr);
          if (
            neighbor &&
            !visited.has(neighbor) &&
            neighbor.tileType === type
          ) {
            stack.push(neighbor);
          }
        }
      }
    }
    return Array.from(visited);
  }

  private burnTiles(group: Tile[], tableController) {
    group.forEach((tile) => {
      const { col, row } = tableController.getTilePosition(tile);
      if (col >= 0 && row >= 0) {
        tableController.removeTile(tile);
        tableController.setTile(col, row, null);
        tableController.getCell(col, row).setFree(true);
      }
    });
  }
}

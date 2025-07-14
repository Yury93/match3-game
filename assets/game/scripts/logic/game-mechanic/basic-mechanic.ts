import type { ITileFactory } from "../../infrastructure/services/gameFactory/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-machanic";
import { MechanicType } from "./mechanic-types";

export class BasicMechanic extends AbstractMechanic {
  constructor(tileFactory: ITileFactory) {
    super(tileFactory);
    this.mechanicType = MechanicType.Basic;
  }
  onTileClick(tile: ITile): boolean {
    const group = this.findConnectedTiles(tile);
    if (group.length < 2) {
      this.tableController.onFalseBurned(tile);
      return false;
    }
    this.tableController.beforeBurnGroupAction(tile, group.length);
    this.burnTiles(group);
    this.dropTiles();
    this.fillEmpty();

    if (this.tableController.onBurnAction) {
      this.tableController.onBurnAction(group.length);
    }

    this.dispatchUseMechanicEvent();
    return true;
  }
  onTurnEnd() {}

  private findConnectedTiles(startTile: ITile): ITile[] {
    if (!startTile || !this.tableController) return [];

    console.log(
      "startTile: ",
      startTile,
      `/tileSprite ${startTile.sprite} / tile node: ${startTile.nodeTile}`,
    );

    const tileCount = this.tableModel.getTileCount();
    const visited = new Set<ITile>();
    const stack = [startTile];
    const targetType = startTile.tileType;

    // Направления
    const directions = [
      { col: -1, row: 0 },
      { col: 1, row: 0 },
      { col: 0, row: -1 },
      { col: 0, row: 1 },
    ];

    while (stack.length > 0) {
      const currentTile = stack.pop()!;
      // Пропускаем уже обработанные
      if (visited.has(currentTile)) continue;

      visited.add(currentTile);

      const position = this.tableModel.getTilePosition(currentTile);
      if (!position) continue;

      // Проверяем всех соседей
      for (const direction of directions) {
        const neighborCol = position.col + direction.col;
        const neighborRow = position.row + direction.row;

        // Проверка выхода за границы сетки
        const isOutsideGrid =
          neighborCol < 0 ||
          neighborRow < 0 ||
          neighborCol >= tileCount.columns ||
          neighborRow >= tileCount.rows;

        if (isOutsideGrid) continue;

        const neighbor = this.tableModel.getTile(neighborCol, neighborRow);

        // Критерии добавления соседа в обработку
        const isValidNeighbor =
          neighbor &&
          !visited.has(neighbor) &&
          neighbor.tileType === targetType;

        if (isValidNeighbor) {
          stack.push(neighbor);
        }
      }
    }

    return Array.from(visited);
  }

  private burnTiles(group: ITile[]) {
    group.forEach((tile) => {
      const { col, row } = this.tableModel.getTilePosition(tile);
      if (col >= 0 && row >= 0) {
        this.tableController.onClearTile(tile);
        this.tableModel.setTile(col, row, null);
        this.tableModel.getCell(col, row).setFree(true);
      }
    });
  }
}

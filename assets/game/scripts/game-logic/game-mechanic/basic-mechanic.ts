import type { ISheduler } from "../../infrastructure/isheduler";
import type { ITileFactory } from "../../infrastructure/services/factories/tile-factory";
import type { ITile } from "../tile";

import { AbstractMechanic } from "./abstract-mechanic";
import { MechanicType } from "./mechanic-types";

export class BasicMechanic extends AbstractMechanic {
  constructor(tileFactory: ITileFactory, sheduler: ISheduler) {
    super(tileFactory, sheduler);
    this.mechanicType = MechanicType.Basic;
  }
  async onTileClick(tile: ITile): Promise<boolean> {
    const group = this.findConnectedTiles(tile);
    if (group.length < 2) {
      this._tableController.onFalseBurned(tile);
      return false;
    }

    this._tableController.beforeBurnGroupAction(tile, group.length);
    this.burnTiles(group);
    await this.dropTiles();
    await this.fillEmpty();

    if (this._tableController.onBurnAction) {
      this._tableController.onBurnAction(group.length);
    }

    this.dispatchUseMechanicEvent();
    return true;
  }
  onTurnEnd() {}

  private findConnectedTiles(startTile: ITile): ITile[] {
    if (!startTile || !this._tableController) return [];

    const tileCount = this._tableModel.getTileCount();
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

      const position = this._tableModel.getTilePosition(currentTile);
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

        const neighbor = this._tableModel.getTile(neighborCol, neighborRow);

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
      const { col, row } = this._tableModel.getTilePosition(tile);
      if (col >= 0 && row >= 0) {
        this._tableController.onClearTile(tile);
        this._tableModel.setTile(col, row, null);
        this._tableModel.getCell(col, row).setFree(true);
      }
    });
  }
}

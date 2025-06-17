import { ITile } from "../tile";
import { IGameMechanic } from "./game-mechanic";

export abstract class AbstractMechanic implements IGameMechanic {
  onTurnEnd(): void {
    throw new Error("Method not implemented.");
  }
  onTileClick(tile: ITile, tableController: any): boolean {
    throw new Error("Method not implemented.");
  }
  protected dropTiles(tableController) {
    const { columns, rows } = tableController.getTileCount();
    for (let col = 0; col < columns; col++) {
      for (let row = rows - 1; row >= 0; row--) {
        if (!tableController.getTile(col, row)) {
          for (let k = row - 1; k >= 0; k--) {
            const upperTile = tableController.getTile(col, k);
            if (upperTile) {
              tableController.setTile(col, row, upperTile);
              tableController.setTile(col, k, null);
              tableController.moveTile(
                upperTile,
                tableController.getCell(col, row).getPosition()
              );
              tableController.getCell(col, row).setFree(false);
              tableController.getCell(col, k).setFree(true);
              break;
            }
          }
        }
      }
    }
  }

  protected fillEmpty(tableController) {
    const { columns, rows } = tableController.getTileCount();
    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        if (!tableController.getTile(col, row)) {
          const cell = tableController.getCell(col, row);
          const newTile = tableController.createRandomTile(cell);
          tableController.setTile(col, row, newTile);
          cell.setFree(false);
          tableController.addTile(newTile, cell);
        }
      }
    }
  }
}

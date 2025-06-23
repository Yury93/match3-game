import { IService } from "./serviceLocator";
import { ITableModel } from "../../logic/table/table-model";

export class MovePlayerValidator implements IService {
  hasPossibleMoves(model: ITableModel): boolean {
    const tiles = model.getTiles();
    const columns = tiles.length;
    const rows = tiles[0].length;

    for (let col = 0; col < columns; col++) {
      for (let row = 0; row < rows; row++) {
        const tile = tiles[col][row];
        if (!tile) continue;

        const neighbors = [
          { x: col + 1, y: row },
          { x: col, y: row + 1 },
          { x: col - 1, y: row },
          { x: col, y: row - 1 },
        ];

        for (const neighbor of neighbors) {
          if (this.isValidPosition(neighbor.x, neighbor.y, columns, rows)) {
            const neighborTile = tiles[neighbor.x][neighbor.y];
            if (neighborTile && neighborTile.tileType === tile.tileType) {
              console.log(`Found possible move for ${tile.tileType}`);
              return true;
            }
          }
        }
      }
    }
    console.log("No possible moves found");
    return false;
  }

  private isValidPosition(
    col: number,
    row: number,
    maxCol: number,
    maxRow: number
  ): boolean {
    return col >= 0 && col < maxCol && row >= 0 && row < maxRow;
  }
}

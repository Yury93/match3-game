import { TileType } from "../game-logic/tiles/tile";

export const TABLE = {
  column: 9,
  lines: 9,
  grid: 100,
};
export const PREFABS = {
  tablePrefab: "table/Table",
  tilePrefab: "tiles/TilePrefab",
};
export const TILE_MODELS: { path: string; type: TileType }[] = [
  { path: "tiles/block_blue", type: TileType.BLUE },
  { path: "tiles/block_green", type: TileType.GREEN },
  { path: "tiles/block_purpure", type: TileType.PURPLE },
  { path: "tiles/block_red", type: TileType.RED },
  { path: "tiles/block_yellow", type: TileType.YELLOW },
];

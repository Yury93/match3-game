import { TileType } from "../logic/tile";

// Геймдизайнерские конфиги
export const TABLE = {
  column: 9,
  lines: 9,
  grid: 100,
};
const GAME_LEVELS: { maxSteps: number; winScoreThreshold: number }[] = [
  { maxSteps: 10, winScoreThreshold: 350 },
];
export type ScoreFormula = (groupSize: number) => number;
const SCORE_FORMULAS: { formula: ScoreFormula }[] = [
  { formula: (groupSize: number) => groupSize * groupSize * 5 },
  { formula: (groupSize: number) => groupSize },
];

export const GLOBAL_GAME_CONFIGS = {
  MaxStep: GAME_LEVELS[0].maxSteps,
  WinScoreThreshold: GAME_LEVELS[0].winScoreThreshold,
  _scoreFormulaIndex: 0,

  get ScoreFormula() {
    return SCORE_FORMULAS[this._scoreFormulaIndex].formula;
  },
};

// Контентные конфиги
export const PREFABS = {
  tablePrefab: "table/Table",
  UIPanelPrefab: "table/UI",
  tilePrefab: "tiles/TilePrefab",
  curtainPrefab: "curtain/Curtain",
};
export const TILE_MODELS: { path: string; type: TileType }[] = [
  { path: "tiles/block_blue", type: TileType.BLUE },
  { path: "tiles/block_green", type: TileType.GREEN },
  { path: "tiles/block_purpure", type: TileType.PURPLE },
  { path: "tiles/block_red", type: TileType.RED },
  { path: "tiles/block_yellow", type: TileType.YELLOW },
];

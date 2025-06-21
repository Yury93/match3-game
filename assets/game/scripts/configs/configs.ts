import { TileType } from "../logic/tile-type";

// Геймдизайнерские конфиги
export const TABLE = [
  {
    column: 9,
    lines: 9,
    grid: 95,
  },
  {
    column: 3,
    lines: 3,
    grid: 95,
  },
];
const GAME_LEVELS: { maxSteps: number; winScoreThreshold: number }[] = [
  { maxSteps: 35, winScoreThreshold: 250 },
  { maxSteps: 40, winScoreThreshold: 300 },
  { maxSteps: 30, winScoreThreshold: 200 },
  { maxSteps: 30, winScoreThreshold: 100 },
  // { maxSteps: 5, winScoreThreshold: 600 },
];
// Для рандомного уровня
function getRandomLevel() {
  const id = Math.floor(Math.random() * GAME_LEVELS.length);
  return GAME_LEVELS[id];
}
const _randomLevel = getRandomLevel();

export const CONSTANTS = {
  boosterBombR: 1,
};
export type ScoreFormula = (groupSize: number) => number;
const SCORE_FORMULAS: { formula: ScoreFormula }[] = [
  { formula: (groupSize: number) => groupSize * groupSize * 5 },
  { formula: (groupSize: number) => groupSize },
];

export const GLOBAL_GAME_CONFIGS = {
  // MaxStep: GAME_LEVELS[0].maxSteps,
  // WinScoreThreshold: GAME_LEVELS[0].winScoreThreshold,
  MaxStep: _randomLevel.maxSteps,
  WinScoreThreshold: _randomLevel.winScoreThreshold,
  _scoreFormulaIndex: 1,

  get ScoreFormula() {
    return SCORE_FORMULAS[this._scoreFormulaIndex].formula;
  },
};

// Контентные конфиги
export const PREFABS = {
  tablePrefab: "table/Table",
  UIPanelPrefab: "table/UI",
  BombEffectPrefab: "table/ExplosionEffect",
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

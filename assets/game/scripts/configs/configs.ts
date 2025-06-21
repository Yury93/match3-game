import { TileType } from "../logic/tile-type";

// Геймдизайнерские конфиги
export const TABLE = [
  {
    column: 9,
    lines: 9,
    grid: 95,
  },
  {
    column: 6,
    lines: 6,
    grid: 95,
  },
];
const GAME_LEVELS: {
  id: number;
  maxSteps: number;
  winScoreThreshold: number;
}[] = [
  { id: 0, maxSteps: 35, winScoreThreshold: 90 },
  { id: 1, maxSteps: 40, winScoreThreshold: 300 },
  { id: 2, maxSteps: 30, winScoreThreshold: 200 },
  { id: 3, maxSteps: 30, winScoreThreshold: 100 },
  { id: 4, maxSteps: 35, winScoreThreshold: 250 },
  { id: 5, maxSteps: 40, winScoreThreshold: 300 },
  { id: 6, maxSteps: 30, winScoreThreshold: 200 },
  { id: 7, maxSteps: 30, winScoreThreshold: 100 },
  { id: 8, maxSteps: 35, winScoreThreshold: 250 },
  { id: 9, maxSteps: 40, winScoreThreshold: 300 },
  { id: 10, maxSteps: 30, winScoreThreshold: 200 },
  { id: 11, maxSteps: 30, winScoreThreshold: 100 },
];

export const CONSTANTS = {
  boosterBombR: 1,
  scoreFormulaIndex: 1,
};
export type ScoreFormula = (groupSize: number) => number;
const SCORE_FORMULAS: { formula: ScoreFormula }[] = [
  { formula: (groupSize: number) => groupSize * groupSize * 5 },
  { formula: (groupSize: number) => groupSize },
];

class GlobalGameConfig {
  getScoreFormula() {
    return SCORE_FORMULAS[CONSTANTS.scoreFormulaIndex].formula;
  }
  getLevel(id: number) {
    const level = GAME_LEVELS.find((level) => level.id === id);
    if (!level) {
      console.error(`Level with id ${id} not found return 0 level`);
      return GAME_LEVELS[0];
    }
    return level;
  }
}
export const GAME_CONFIG = new GlobalGameConfig();

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

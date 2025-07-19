import { TileType } from "../logic/tile-type";

import type {
  IConstantsConfig,
  IGameLevelsConfig,
  IGlobalGameConfig,
  IPrefabsConfig,
  IScoreFormula,
  ITableConfig,
  ITileModelsConfig,
} from "./config-types";

/**
 * Конфигурации игровых полей разных размеров
 * @type {ITableConfig[]}
 */
export const TABLE: ITableConfig[] = [
  // { // для теста ситуации, когда невозможно сжечь группу
  //   column: 2,
  //   lines: 2,
  //   grid: 95,
  // },
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

/**
 * Конфигурации всех игровых уровней
 * @type {IGameLevelsConfig[]}
 * @param {number} id - идентификатор уровня
 * @param {number} maxSteps - кол-во макс шагов на уровне
 * @param {number} winScoreThreshold - минимальное количество очков для успеха
 */
export const GAME_LEVELS: IGameLevelsConfig[] = [
  { id: 0, maxSteps: 15, winScoreThreshold: 50 },
  { id: 1, maxSteps: 12, winScoreThreshold: 40 },
  { id: 2, maxSteps: 10, winScoreThreshold: 45 },
  { id: 3, maxSteps: 9, winScoreThreshold: 50 },
  { id: 4, maxSteps: 8, winScoreThreshold: 55 },
  { id: 5, maxSteps: 7, winScoreThreshold: 60 },
  { id: 6, maxSteps: 7, winScoreThreshold: 65 },
  { id: 7, maxSteps: 8, winScoreThreshold: 70 },
  { id: 8, maxSteps: 8, winScoreThreshold: 75 },
  { id: 9, maxSteps: 9, winScoreThreshold: 80 },
  { id: 10, maxSteps: 9, winScoreThreshold: 85 },
  { id: 11, maxSteps: 10, winScoreThreshold: 90 },
  { id: 12, maxSteps: 10, winScoreThreshold: 95 },
  { id: 13, maxSteps: 11, winScoreThreshold: 100 },
  { id: 14, maxSteps: 11, winScoreThreshold: 105 },
  { id: 15, maxSteps: 12, winScoreThreshold: 110 },
  { id: 16, maxSteps: 12, winScoreThreshold: 115 },
  { id: 17, maxSteps: 13, winScoreThreshold: 120 },
  { id: 18, maxSteps: 13, winScoreThreshold: 125 },
  { id: 19, maxSteps: 14, winScoreThreshold: 130 },
];

/**
 * Глобальные игровые константы
 * @type {IConstantsConfig}
 * @param {number} boosterBombR - радиус действия бомбы
 * @param {number} scoreFormulaIndex - индекс используемой формулы подсчета очков
 * @param {number} bombTrials - количество доступных бустера "бомб"
 * @param {number} teleportTrials - количество доступных бустера "телепортов"
 */
export const CONSTANTS: IConstantsConfig = {
  boosterBombR: 1,
  scoreFormulaIndex: 1,
  bombTrials: 3,
  teleportTrials: 3,
};

/**
 * Доступные формулы расчета очков
 * @type {IScoreFormula[]}
 */
export const SCORE_FORMULAS: IScoreFormula[] = [
  { formula: (groupSize: number) => groupSize * groupSize * 5 }, // Квадратичная формула
  { formula: (groupSize: number) => groupSize }, // Линейная формула
];

/**
 * Класс глобальной конфигурации игры
 * @implements {IGlobalGameConfig}
 */
export class GlobalGameConfig implements IGlobalGameConfig {
  /**
   * Возвращает текущую формулу расчета очков
   * @returns {ScoreFormula}
   */
  getScoreFormula() {
    return SCORE_FORMULAS[CONSTANTS.scoreFormulaIndex].formula;
  }

  /**
   * Возвращает конфигурацию уровня по id
   * @param {number} id - идентификатор уровня
   * @returns {IGameLevelsConfig}
   */
  getLevel(id: number) {
    const level = GAME_LEVELS.find((level) => level.id === id);
    if (!level) {
      cc.error(`Level with id ${id} not found return 0 level`);
      return GAME_LEVELS[0];
    }
    return level;
  }
}

/**
 * Глобальная конфигурация
 * @type {IGlobalGameConfig}
 */
export const GAME_CONFIG: IGlobalGameConfig = new GlobalGameConfig();

/**
 * Пути к префабам
 * @type {IPrefabsConfig}
 */
export const PREFABS: IPrefabsConfig = {
  tablePrefab: "table/Table",
  uIPanelPrefab: "table/UI",
  bombEffectPrefab: "table/ExplosionEffect",
  tilePrefab: "tiles/TilePrefab",
  curtainPrefab: "curtain/Curtain",
  labelPrefab: "table/label",
  getAll() {
    return Object.values(this).filter(
      (value) => typeof value === "string",
    ) as string[];
  },
};

/**
 * Модели плиток
 * @type {ITileModelsConfig[]}
 */
export const TILE_MODELS: ITileModelsConfig[] = [
  { path: "tiles/block_blue", type: TileType.BLUE },
  { path: "tiles/block_green", type: TileType.GREEN },
  { path: "tiles/block_purpure", type: TileType.PURPLE },
  { path: "tiles/block_red", type: TileType.RED },
  { path: "tiles/block_yellow", type: TileType.YELLOW },
];

import { TileType } from "../logic/tile-type";

/**
 * Конфигурация игрового поля
 * @property column - количество столбцов в сетке
 * @property lines - количество строк в сетке
 * @property grid - размер одной ячейки в пикселях
 */
export interface ITableConfig {
  column: number;
  lines: number;
  grid: number;
}

/**
 * Конфигурация игровых уровней
 * @property id - id уровня
 * @property maxSteps - максимальное количество ходов
 * @property winScoreThreshold - минимальное количество очков для победы
 */
export interface IGameLevelsConfig {
  id: number;
  maxSteps: number;
  winScoreThreshold: number;
}

/**
 * Глобальные игровые константы
 * @property boosterBombR - радиус действия бомбы
 * @property scoreFormulaIndex - индекс используемой формулы подсчета очков
 * @property bombTrials - количество доступных бомб
 * @property teleportTrials - количество доступных телепортов
 */
export interface IConstantsConfig {
  boosterBombR: number;
  scoreFormulaIndex: number;
  bombTrials: number;
  teleportTrials: number;
}

/**
 * Пути к игровым префабам
 * @property tablePrefab - префаб игрового поля
 * @property uIPanelPrefab - префаб UI панели
 * @property bombEffectPrefab - префаб эффекта взрыва(бустер бомба)
 * @property tilePrefab - базовый префаб плитки
 * @property curtainPrefab - префаб занавеса
 * @property labelPrefab - префаб флай текста
 */
export interface IPrefabsConfig {
  tablePrefab: string;
  uIPanelPrefab: string;
  bombEffectPrefab: string;
  tilePrefab: string;
  curtainPrefab: string;
  labelPrefab: string;
  getAll();
}

/**
 * Конфигурация визуального представления плиток
 * @property path - путь к ассету плитки
 * @property type - тип плитки из перечисления TileType
 */
export interface ITileModelsConfig {
  path: string;
  type: TileType;
}

/**
 * Тип функции для расчета очков
 * @param groupSize - количество плиток в совпадении
 * @returns количество начисляемых очков
 */
export type ScoreFormula = (groupSize: number) => number;

/**
 * Контейнер для формулы расчета очков
 * @property formula - функция расчета очков
 */
export interface IScoreFormula {
  formula: ScoreFormula;
}

/**
 * Основной интерфейс конфигурации игры
 * @method getScoreFormula - возвращает текущую формулу расчета очков
 * @method getLevel - возвращает конфигурацию уровня по id
 */
export interface IGlobalGameConfig {
  getScoreFormula(): ScoreFormula;
  getLevel(id: number): IGameLevelsConfig;
}

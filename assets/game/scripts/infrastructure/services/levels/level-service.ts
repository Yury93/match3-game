import type {
  IGameLevelsConfig,
  IGlobalGameConfig,
} from "../../../configs/config-types";
import type { IService } from "../serviceLocator";
interface ILevelProgressController {
  nextLevel();
  resetProgress();
}
export interface ILevelService extends ILevelProgressController, IService {
  getCurrentLevel(): IGameLevelsConfig;
  getCurrentMapId(): number;
  getLevel(levelId: number): IGameLevelsConfig;
  getScoreFormula();
}
export class LevelService implements ILevelService {
  private _currentLevelId = 0;
  private _mapId: number = 0;
  constructor(private _config: IGlobalGameConfig) {}

  getCurrentLevel() {
    return this._config.getLevel(this._currentLevelId);
  }
  getCurrentMapId() {
    return this._mapId;
  }
  getLevel(levelId: number) {
    return this._config.getLevel(levelId);
  }
  nextLevel() {
    this._currentLevelId++;
    if (this._config.getConditionNextMap(this._currentLevelId)) {
      this._mapId++;
    }
  }
  resetProgress() {
    this._currentLevelId = 0;
    this._mapId = 0;
  }
  getScoreFormula() {
    return this._config.getScoreFormula();
  }
}

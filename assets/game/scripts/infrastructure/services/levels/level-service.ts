import { LevelConfigService } from "./level-config-service";
import { IService } from "../serviceLocator";

export class LevelService implements IService {
  private _currentLevelId = 0;

  constructor(private _levelConfig: LevelConfigService) {}

  getCurrentLevel() {
    return this._levelConfig.getLevel(this._currentLevelId);
  }

  nextLevel() {
    this._currentLevelId++;
  }

  reset() {
    this._currentLevelId = 0;
  }
}

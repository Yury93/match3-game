import { GAME_CONFIG } from "../../../configs/configs";
import { IService } from "../serviceLocator";

export class LevelConfigService implements IService {
  constructor(private _config = GAME_CONFIG) {}

  getLevel(levelId: number) {
    return this._config.getLevel(levelId);
  }

  getScoreFormula() {
    return this._config.getScoreFormula();
  }
}

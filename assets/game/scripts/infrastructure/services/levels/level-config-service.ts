import { IGlobalGameConfig } from "../../../configs/config-types";
import type { IService } from "../serviceLocator";

export class LevelConfigService implements IService {
  constructor(private _config: IGlobalGameConfig) {}

  getLevel(levelId: number) {
    return this._config.getLevel(levelId);
  }

  getScoreFormula() {
    return this._config.getScoreFormula();
  }
}

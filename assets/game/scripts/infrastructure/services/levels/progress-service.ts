import { ScoreFormula } from "../../../configs/config-types";
import type { IService } from "../serviceLocator";
import { LevelService } from "./level-service";

export interface IProgressService extends IService {
  currentScore: number;
  remainingSteps: number;
  isGameOver: boolean;

  getWinScoreThreshold();
  getMaxStep();
  resetLevel();
  nextStep(groupSize: number);
}

export class ProgressService implements IProgressService {
  currentScore = 0;
  remainingSteps: number;
  isGameOver = false;

  constructor(
    private _levelService: LevelService,
    private _scoreFormula: ScoreFormula,
  ) {
    this.resetLevel();
  }

  getWinScoreThreshold() {
    return this._levelService.getCurrentLevel().winScoreThreshold;
  }

  getMaxStep() {
    return this._levelService.getCurrentLevel().maxSteps;
  }

  resetLevel() {
    const level = this._levelService.getCurrentLevel();
    this.remainingSteps = level.maxSteps;
    this.isGameOver = false;
    this.currentScore = 0;
  }

  nextStep(groupSize: number) {
    if (groupSize > 1) {
      this.currentScore += this._scoreFormula(groupSize);
    }
    this.remainingSteps--;

    this.checkGameOver();
  }

  checkGameOver(): boolean {
    return (this.isGameOver =
      this.currentScore >=
        this._levelService.getCurrentLevel().winScoreThreshold ||
      this.remainingSteps <= 0);
  }
}

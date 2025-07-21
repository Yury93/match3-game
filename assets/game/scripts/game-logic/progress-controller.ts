import type { LevelService } from "../infrastructure/services/levels/level-service";
import type { IProgressService } from "../infrastructure/services/levels/progress-service";

export class ProgressController {
  onWinEvent: () => void;
  onLoseEvent: () => void;

  constructor(
    public progress: IProgressService,
    public levels: LevelService,
  ) {}

  getWinScoreThreshold(): number {
    return this.levels.getCurrentLevel().winScoreThreshold;
  }

  getMaxStep(): number {
    return this.levels.getCurrentLevel().maxSteps;
  }

  getCurrentScore(): number {
    return this.progress.currentScore;
  }

  getRemainingSteps(): number {
    return this.progress.remainingSteps;
  }
  onWin() {
    this.levels.nextLevel();
    this.progress.resetLevel();
  }

  onLose() {
    this.levels.reset();
    this.progress.resetLevel();
  }
  checkProgress() {
    if (this.getCurrentScore() >= this.getWinScoreThreshold()) {
      if (this.onWinEvent) this.onWinEvent();
      this.onWin();
    } else if (this.getRemainingSteps() <= 0) {
      if (this.onLoseEvent) this.onLoseEvent();
      this.onLose();
    }
  }
}

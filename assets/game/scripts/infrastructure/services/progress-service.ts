import { GAME_CONFIG, ScoreFormula } from "../../configs/configs";

export interface IProgressService {
  currentScore: number;
  remainingSteps: number;
  isGameOver: boolean;
  readonly winScoreThreshold: number;
  readonly maxStep: number;
  onWin: () => void;
  onLose: () => void;
  nextStep(groupSize: number): void;
  checkGameOver(): boolean;
  resetResults();
  resetLevel();
}
export class ProgressService implements IProgressService {
  currentScore = 0;
  remainingSteps: number;
  isGameOver = false;
  currentLevelId = 0;
  winScoreThreshold: number;
  maxStep: number;
  private _scoreFormula: ScoreFormula;
  onWin: () => void;
  onLose: () => void;

  constructor() {
    this.resetLevel();
  }
  resetLevel() {
    const level = GAME_CONFIG.getLevel(this.currentLevelId);
    this.maxStep = level.maxSteps;
    this.remainingSteps = level.maxSteps;
    this.winScoreThreshold = level.winScoreThreshold;
    this._scoreFormula = GAME_CONFIG.getScoreFormula();
  }
  nextStep(groupSize: number) {
    if (groupSize > 1) {
      this.currentScore += this.calculateScoreForBurnedGroup(groupSize);
    }
    this.remainingSteps--;
    this.checkGameOver();
  }
  private calculateScoreForBurnedGroup(groupSize: number): number {
    return this._scoreFormula(groupSize);
  }
  checkGameOver(): boolean {
    if (this.currentScore >= this.winScoreThreshold) {
      this.isGameOver = true;
      this.currentLevelId += 1;
      if (this.onWin) this.onWin();
    } else if (this.remainingSteps <= 0) {
      this.isGameOver = true;
      this.currentLevelId += 1;
      if (this.onLose) this.onLose();
    }
    return this.isGameOver;
  }
  resetResults() {
    this.currentScore = 0;
    this.isGameOver = false;
    this.resetLevel();
  }
}

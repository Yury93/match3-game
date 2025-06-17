import { GLOBAL_GAME_CONFIGS, ScoreFormula } from "../../configs/configs";
import { IStateMachine } from "../state-machine/state-interfaces";

export interface IProgressService {
  currentScore: number;
  remainingSteps: number;
  isGameOver: boolean;
  readonly WinScoreThreshold: number;
  readonly MaxStep: number;
  onWin: () => void;
  onLose: () => void;
  nextStep(groupSize: number): void;
  checkGameOver(): boolean;
  resetResults();
  resetSteps();
}
export class ProgressService implements IProgressService {
  currentScore = 0;
  remainingSteps: number;
  isGameOver = false;
  readonly WinScoreThreshold: number;
  readonly MaxStep: number;
  private _scoreFormula: ScoreFormula;
  onWin: () => void;
  onLose: () => void;

  constructor(private _stateMachine: IStateMachine) {
    this.MaxStep = GLOBAL_GAME_CONFIGS.MaxStep;
    this.remainingSteps = GLOBAL_GAME_CONFIGS.MaxStep;
    this.WinScoreThreshold = GLOBAL_GAME_CONFIGS.WinScoreThreshold;
    this._scoreFormula = GLOBAL_GAME_CONFIGS.ScoreFormula;
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
    if (this.currentScore >= this.WinScoreThreshold) {
      this.isGameOver = true;

      if (this.onWin) this.onWin();
    } else if (this.remainingSteps <= 0) {
      this.isGameOver = true;
      if (this.onLose) this.onLose();
    }
    return this.isGameOver;
  }
  resetResults() {
    this.currentScore = 0;
    this.isGameOver = false;
  }
  resetSteps() {
    this.remainingSteps = GLOBAL_GAME_CONFIGS.MaxStep;
  }
}

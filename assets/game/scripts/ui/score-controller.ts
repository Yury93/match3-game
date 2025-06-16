import { IScoreService } from "../infrastructure/services/score-service";
import UiPanelView from "./ui-panel";

export class ScoreController {
  constructor(
    private _scoreService: IScoreService,
    private _uiPanelView: UiPanelView
  ) {
    this.start();
  }
  private start() {
    this._uiPanelView.init(
      this._scoreService.WinScoreThreshold,
      this._scoreService.MaxStep
    );
  }
  updateScore() {
    this._uiPanelView.updateScore(this._scoreService.currentScore);
    this._uiPanelView.updateStep(this._scoreService.remainingSteps);
  }
}

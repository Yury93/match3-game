import { IGameFactory } from "../infrastructure/services/gameFactory/game-factory";
import { IMechanicService } from "../infrastructure/services/mechanic-service";
import { IProgressService } from "../infrastructure/services/progress-service";
import { BasicMechanic } from "../logic/game-mechanic/basic-mechanic";
import { BoosterBomb } from "../logic/game-mechanic/booster-bomb";
import UiPanelView from "./ui-panel";

export class UIPanelController {
  private _bombTrial = 3;
  constructor(
    private _progressService: IProgressService,
    private _uiPanelView: UiPanelView,
    private _mechanicService: IMechanicService,
    private _gameFactory: IGameFactory
  ) {
    this.start();
  }
  private start() {
    this._uiPanelView.init(
      this._progressService.WinScoreThreshold,
      this._progressService.MaxStep
    );
    this._uiPanelView.showBombCount(this._bombTrial);
    this._uiPanelView.onClickBomb = () => {
      if (!(this._mechanicService.activeMechanic() instanceof BasicMechanic))
        return;
      if (this._bombTrial > 0) {
        this._uiPanelView.bombButtonActive(true);
        this.setActiveBomb();
        this._bombTrial -= 1;
        if (this._bombTrial === 0) this._uiPanelView.bombButtonActive(false);
      } else {
        this._uiPanelView.bombButtonActive(false);
      }
      this._uiPanelView.showBombCount(this._bombTrial);
    };
  }
  updateScore() {
    this._uiPanelView.updateScore(this._progressService.currentScore);
    this._uiPanelView.updateStep(this._progressService.remainingSteps);
  }
  setActiveBomb() {
    this._mechanicService.setActiveMechanic(
      this._mechanicService.getMechanicByType(BoosterBomb)
    );
  }
}

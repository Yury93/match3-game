import { IGameFactory } from "../infrastructure/services/gameFactory/game-factory";
import { IMechanicController } from "../logic/game-mechanic/mechanic-controller";
import { IProgressService } from "../infrastructure/services/progress-service";
import { BasicMechanic } from "../logic/game-mechanic/basic-mechanic";
import { BoosterBombMechanic } from "../logic/game-mechanic/booster-bomb-mechanic";
import { IUIPanelView } from "./ui-panel";
import { IGameMechanic } from "../logic/game-mechanic/game-mechanic";

export class UIPanelController {
  private _bombTrial = 3;
  constructor(
    private _progressService: IProgressService,
    private _uiPanelView: IUIPanelView,
    private _mechanicService: IMechanicController
  ) {
    this.start();
  }
  private start() {
    this._uiPanelView.init(
      this._progressService.winScoreThreshold,
      this._progressService.maxStep
    );
    this._uiPanelView.showBombCount(this._bombTrial);
    this._uiPanelView.onClickBomb = () => {
      const activeMechanic: IGameMechanic =
        this._mechanicService.getActiveMechanic();

      if (!(activeMechanic as BasicMechanic)) return;
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
    const bombMechanic =
      this._mechanicService.getMechanicByType(BoosterBombMechanic);
    console.log("bombMechanic = ", bombMechanic);
    this._mechanicService.setActiveMechanic(bombMechanic);
  }
}

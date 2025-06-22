import { IMechanicController } from "../logic/game-mechanic/mechanic-controller";
import { IProgressService } from "../infrastructure/services/progress-service";
import { BasicMechanic } from "../logic/game-mechanic/basic-mechanic";
import { BoosterBombMechanic } from "../logic/game-mechanic/booster-bomb-mechanic";
import { IUIPanelView } from "./ui-panel";
import { IGameMechanic } from "../logic/game-mechanic/game-mechanic";
import { TeleportBoosterMechanic } from "../logic/game-mechanic/teleport-booster-mechanic";

export class UIPanelController {
  constructor(
    private _progressService: IProgressService,
    private _uiPanelView: IUIPanelView,
    private _mechanicService: IMechanicController,
    private _bombTrial = 3
  ) {
    this.start();
  }
  private start() {
    this._uiPanelView.init(
      this._progressService.winScoreThreshold,
      this._progressService.maxStep
    );
    this._uiPanelView.showBombCount(this._bombTrial);
    this._uiPanelView.onClickBomb = () => this.onClickBomb();
    this._uiPanelView.onClickTeleport = () => this.setActiveTeleport();
  }

  getBombTrials() {
    return this._bombTrial;
  }
  summonClickBomb() {
    this._uiPanelView.startbombSummonAnimation();
  }
  updateScore() {
    this._uiPanelView.updateScore(this._progressService.currentScore);
    this._uiPanelView.updateStep(this._progressService.remainingSteps);
  }
  setActiveBomb() {
    const bombMechanic =
      this._mechanicService.getMechanicByType(BoosterBombMechanic);
    this._mechanicService.setActiveMechanic(bombMechanic);
  }
  setActiveTeleport() {
    const teleportMechanic = this._mechanicService.getMechanicByType(
      TeleportBoosterMechanic
    );
    this._mechanicService.setActiveMechanic(teleportMechanic);
  }
  private onClickBomb() {
    const activeMechanic: IGameMechanic =
      this._mechanicService.getActiveMechanic();

    if (!(activeMechanic as BasicMechanic)) return;
    if (this._bombTrial > 0) {
      this._uiPanelView.activeBombButton(true);
      this.setActiveBomb();
      this._bombTrial -= 1;
      if (this._bombTrial === 0) this._uiPanelView.activeBombButton(false);
    } else {
      this._uiPanelView.activeBombButton(false);
    }
    this._uiPanelView.showBombCount(this._bombTrial);
  }
}

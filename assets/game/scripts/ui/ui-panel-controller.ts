import { IMechanicController } from "../logic/game-mechanic/mechanic-controller";
import { BoosterBombMechanic } from "../logic/game-mechanic/booster-bomb-mechanic";
import { IUIPanelView } from "./ui-panel";
import { IGameMechanic } from "../logic/game-mechanic/game-mechanic";
import { TeleportBoosterMechanic } from "../logic/game-mechanic/teleport-booster-mechanic";
import { ITile } from "../logic/tile";
import { BoosterHandler } from "../logic/game-mechanic/booster-handler";
import { IProgressService } from "../infrastructure/services/levels/progress-service";
import { ProgressController } from "../logic/progress-controller";

export class UIPanelController {
  constructor(
    private _progressController: ProgressController,
    private _progressService: IProgressService,
    private _uiPanelView: IUIPanelView,
    private _mechanicService: IMechanicController,
    private boosterService: BoosterHandler
  ) {
    this.start();
  }

  private start() {
    this._uiPanelView.init(
      this._progressController.getWinScoreThreshold(),
      this._progressService.getMaxStep()
    );

    this.updateBoostersUI();

    this.boosterService.onUpdate(() => this.updateBoostersUI());

    this._uiPanelView.onBombButtonClick = () => this.onClickBombBooster();
    this._uiPanelView.onTeleportButtonClick = () =>
      this.onClickTeleportBooster();
    this._mechanicService.onClickTile = (tile) => this.onClickTile(tile);
  }
  removeBoosterListeners() {
    this._uiPanelView.removeListeners();
    this._mechanicService.removeListeners();
  }
  private updateBoostersUI(): void {
    const bombCount = this.boosterService.getBombTrials();
    const teleportCount = this.boosterService.getTeleportTrials();

    this._uiPanelView.updateBombCount(bombCount);
    this._uiPanelView.updateTeleportCount(teleportCount);

    this._uiPanelView.setBombButtonActive(bombCount > 0);
    this._uiPanelView.setTeleportButtonActive(teleportCount > 0);
  }

  summonClickBomb() {
    this._uiPanelView.playBombSummonAnimation();
  }

  updateScore() {
    this._uiPanelView.updateScore(this._progressService.currentScore);
    this._uiPanelView.updateStep(this._progressService.remainingSteps);
  }

  private onClickTeleportBooster() {
    const activeMechanic: IGameMechanic =
      this._mechanicService.getActiveMechanic();
    if (activeMechanic instanceof TeleportBoosterMechanic) return;

    if (this.boosterService.getTeleportTrials() > 0) {
      const teleportMechanic = this._mechanicService.getMechanicByType(
        TeleportBoosterMechanic
      );
      this._mechanicService.setActiveMechanic(teleportMechanic);
      this._uiPanelView.playTeleportActivationAnimation();
    }
  }

  private onClickBombBooster() {
    const activeMechanic: IGameMechanic =
      this._mechanicService.getActiveMechanic();
    if (activeMechanic instanceof BoosterBombMechanic) return;

    if (this.boosterService.getBombTrials() > 0) {
      this.setActiveBomb();
      this._uiPanelView.playBombActivationAnimation();
    }
  }

  private onClickTile(tile: ITile): void {}

  private setActiveBomb() {
    const bombMechanic =
      this._mechanicService.getMechanicByType(BoosterBombMechanic);
    if (!bombMechanic) {
      console.error("bombMechanic is undefined");
      return;
    }
    this._mechanicService.setActiveMechanic(bombMechanic);
  }
}

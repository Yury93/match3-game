import { IMechanicController } from "../logic/game-mechanic/mechanic-controller";
import { IProgressService } from "../infrastructure/services/progress-service";
import { BoosterBombMechanic } from "../logic/game-mechanic/booster-bomb-mechanic";
import { IUIPanelView } from "./ui-panel";
import { IGameMechanic } from "../logic/game-mechanic/game-mechanic";
import { TeleportBoosterMechanic } from "../logic/game-mechanic/teleport-booster-mechanic";
import { ITile } from "../logic/tile";
import {
  IMechanicEvent,
  IMechanicObserver,
  MechanicEventSystem,
  MechanicEventType,
} from "../logic/game-mechanic/mechanic-event-system";
import { MechanicType } from "../logic/game-mechanic/mechanic-types";

export class UIPanelController implements IMechanicObserver {
  constructor(
    private _progressService: IProgressService,
    private _uiPanelView: IUIPanelView,
    private _mechanicService: IMechanicController,
    private _bombTrial,
    private _teleportTrial
  ) {
    this.start();
  }

  private start() {
    this._uiPanelView.init(
      this._progressService.winScoreThreshold,
      this._progressService.maxStep
    );
    this._progressService.onLose = () => {
      MechanicEventSystem.unsubscribe(this);
    };
    this._progressService.onWin = () => {
      MechanicEventSystem.unsubscribe(this);
    };
    this._uiPanelView.updateBombCount(this._bombTrial);
    this._uiPanelView.updateTeleportCount(this._teleportTrial);
    this._uiPanelView.onBombButtonClick = () => this.onClickBombBooster();
    this._uiPanelView.onTeleportButtonClick = () =>
      this.onClickTeleportBooster();
    this._mechanicService.onClickTile = (tile) => this.onClickTile(tile);
    MechanicEventSystem.subscribe(this);
  }
  onMechanicEvent(event: IMechanicEvent): void {
    if (event.type !== MechanicEventType.MECHANIC_USED) {
      return;
    }
    if (event.mechanicType === MechanicType.BombBoster) {
      if (this._bombTrial > 0) {
        this._uiPanelView.setBombButtonActive(true);
        this._bombTrial -= 1;
        this._uiPanelView.updateBombCount(this._bombTrial);
        if (this._bombTrial === 0) this._uiPanelView.setBombButtonActive(false);
      } else {
        this._uiPanelView.setBombButtonActive(false);
      }
    } else if (event.mechanicType === MechanicType.TeleportBoster) {
      if (this._teleportTrial > 0) {
        this._uiPanelView.setTeleportButtonActive(true);
        this._teleportTrial -= 1;
        this._uiPanelView.updateTeleportCount(this._teleportTrial);
        if (this._teleportTrial === 0)
          this._uiPanelView.setTeleportButtonActive(false);
      } else {
        this._uiPanelView.setTeleportButtonActive(false);
      }
    }
  }
  getBombTrials() {
    return this._bombTrial;
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
    if (this._teleportTrial > 0) {
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
    if (this._bombTrial > 0) {
      this.setActiveBomb();
      this._uiPanelView.playBombActivationAnimation();
    }
  }
  private onClickTile(tile: ITile): void {}
  private setActiveBomb() {
    const bombMechanic =
      this._mechanicService.getMechanicByType(BoosterBombMechanic);
    if (bombMechanic === undefined) {
      console.error("bombMechanic is undefined");
      return;
    }
    this._mechanicService.setActiveMechanic(bombMechanic);
  }
}

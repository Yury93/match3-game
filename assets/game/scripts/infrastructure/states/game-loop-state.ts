import type { BoosterHandler } from "../../game-logic/game-mechanic/booster-handler";
import type { ProgressLevelController } from "../../game-logic/progress-level-controller";
import type { ITableController } from "../../game-logic/table/table-controller";
import type { ITableModel } from "../../game-logic/table/table-model";
import type { IUIPanelView } from "../../game-logic/ui/ui-panel";
import type { UIPanelController } from "../../game-logic/ui/ui-panel-controller";
import type { IProgressService } from "../services/levels/progress-service";
import type { MovePlayerValidator } from "../services/move-validator";
import type { IState, IStateMachine } from "../state-machine/state-interfaces";
import { StateNames } from "../state-machine/state-names";

export class GameLoopState implements IState {
  private _isResultShown = false;
  private _tableModel: ITableModel;
  private _tableController: ITableController;
  private _boosterHandler: BoosterHandler;
  private _uiPanelController: UIPanelController;
  private _progressController: ProgressLevelController;

  constructor(
    private _stateMachine: IStateMachine,
    private _progressService: IProgressService,
    private _movePlayerValidator: MovePlayerValidator,
  ) {}

  run(payload: {
    tableModel: ITableModel;
    tableController: ITableController;
    uiPanelView: IUIPanelView;
    uiPanelController: UIPanelController;
    boosterHandler: BoosterHandler;
    progressController: ProgressLevelController;
  }): void {
    this._isResultShown = false;

    this._tableModel = payload.tableModel;
    this._tableController = payload.tableController;
    this._boosterHandler = payload.boosterHandler;
    this._uiPanelController = payload.uiPanelController;
    this._progressController = payload.progressController;

    this.tryResolveMoves();

    this._tableController.onBurnAction = this.handleBurnAction.bind(this);
    this._tableController.onEndTurnAction = this.tryResolveMoves.bind(this);
    this._tableController.onFalseBurned = this.handleFalseBurned.bind(this);

    this._progressController.onWinEvent = () =>
      this.handleGameEnd("win", "успех!");

    this._progressController.onLoseEvent = () =>
      this.handleGameEnd("lose", "закончились\n шаги...");
  }

  private handleBurnAction(groupSize: number): void {
    this._progressService.nextStep(groupSize);
    this._uiPanelController.updateScore();
    this._progressController.checkProgress();
    this.tryResolveMoves();
  }

  private handleFalseBurned(tile): void {
    if (this._boosterHandler.getBombTrials() > 0) {
      this._uiPanelController.summonClickBomb();
    }
    if (!this._isResultShown && !this.hasBoosterTrials()) {
      this._progressController.checkProgress();
    }
    this._tableController.onFalseBurnedAction(tile);
    this.tryResolveMoves();
  }

  private hasBoosterTrials(): boolean {
    return (
      this._boosterHandler.getBombTrials() > 0 ||
      this._boosterHandler.getTeleportTrials() > 0
    );
  }

  private tryResolveMoves(): void {
    if (this._isResultShown || this.hasBoosterTrials()) return;
    this.resolveImpossibleMoves();
  }

  private resolveImpossibleMoves(): void {
    if (!this._movePlayerValidator.hasPossibleMoves(this._tableModel)) {
      this.handleGameEnd("lose", "нет\n вариантов...");
    }
  }

  private handleGameEnd(results: string, message: string): void {
    this._tableController.onBurnAction = null;
    this._tableController.onFalseBurned = null;
    this._boosterHandler.unsubscribes();
    this._isResultShown = true;
    this._tableController.removeClickTileListeners();
    this._uiPanelController.removeBoosterListeners();

    this._stateMachine.run(StateNames.ResultState, {
      result: results,
      message,
      tableController: this._tableController,
    });
  }

  stop(): void {}
}

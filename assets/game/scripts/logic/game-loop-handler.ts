import { IProgressService } from "../infrastructure/services/levels/progress-service";
import { MovePlayerValidator } from "../infrastructure/services/move-validator";
import { IGameLoopPayload } from "../infrastructure/state-machine/payloads";
import { IStateMachine } from "../infrastructure/state-machine/state-interfaces";
import { StateNames } from "../infrastructure/state-machine/state-names";
import { UIPanelController } from "../ui/ui-panel-controller";
import { BoosterHandler } from "./game-mechanic/booster-handler";
import { ITableController } from "./table/table-controller";
import { ITile } from "./tile";
 
export interface IGameLoopHandler{
    init(
    stateMachine: IStateMachine,
    progressService: IProgressService,
    gameLoopPayload: IGameLoopPayload,
    moveValidator: MovePlayerValidator
  );
}
export class GameLoopHandler implements IGameLoopHandler {
  private _gameLoopPayload: IGameLoopPayload;
  private _gameEventCoordinator: GameEventCoordinator;
  private _gameEndHandler: GameEndHandler;
  private _movePlayerValidator: MovePlayerValidator;
  private _isResultShown = false;
  private _stateMachine: IStateMachine;
  private _progressService: IProgressService;
  init(
    stateMachine: IStateMachine,
    progressService: IProgressService,
    gameLoopPayload: IGameLoopPayload,
    moveValidator: MovePlayerValidator
  ) {
    this._gameLoopPayload = gameLoopPayload;
    this._movePlayerValidator = moveValidator;
    this._stateMachine = stateMachine;
    this._progressService = progressService;

    

    this._gameEventCoordinator = new GameEventCoordinator(
      this._gameLoopPayload.tableController,
     (groupSize: number) => this.handleBurnAction(groupSize),
      () => this.handleEndTurnAction(),
      (tile: ITile) => this.handleFalseBurned(tile)
    );
     this._gameEndHandler = new GameEndHandler(
      this._stateMachine,
      this._gameLoopPayload.tableController,
      this._gameLoopPayload.boosterHandler,
      this._gameLoopPayload.uiPanelController,
      this._gameEventCoordinator
    );

    this.setupProgressEvents();
    this.tryResolveMoves();
  } 


  private setupProgressEvents() {
    this._gameLoopPayload.progressController.onWinEvent = () =>
      this._gameEndHandler.handleGameEnd("win", "Успех!");

    this._gameLoopPayload.progressController.onLoseEvent = () =>
      this._gameEndHandler.handleGameEnd("lose", "Закончились\n шаги...");
  }
  private tryResolveMoves(): void {
    if (this._isResultShown || this.hasBoosterTrials()) return;
    this.resolveImpossibleMoves();
  }
  private handleBurnAction(groupSize: number) {
    this._progressService.nextStep(groupSize);
    this._gameLoopPayload.uiPanelController.updateScore();
    this._gameLoopPayload.progressController.checkProgress();
    this.tryResolveMoves();
  } 
  private handleEndTurnAction() {
    this.tryResolveMoves();
  } 
  private handleFalseBurned(tile: ITile) {
    if (this._gameLoopPayload.boosterHandler.getBombTrials() > 0) {
      this._gameLoopPayload.uiPanelController.summonClickBomb();
    }

    if (!this._isResultShown && !this.hasBoosterTrials()) {
      this._gameLoopPayload.progressController.checkProgress();
    }

    this._gameLoopPayload.tableController.onFalseBurnedAction(tile);
    this.tryResolveMoves();
  } 
  private hasBoosterTrials(): boolean {
    return (
      this._gameLoopPayload.boosterHandler.getBombTrials() > 0 ||
      this._gameLoopPayload.boosterHandler.getTeleportTrials() > 0
    );
  } 
  private resolveImpossibleMoves(): void {
    if (
      !this._movePlayerValidator.hasPossibleMoves(
        this._gameLoopPayload.tableModel
      )
    ) {
      this._gameEndHandler.handleGameEnd("lose", "Нет\n вариантов...");
    }
  }
}

class GameEventCoordinator {
  constructor(
    private _tableController: ITableController,
    private onBurnHandler: (groupSize: number) => void,
    private onEndTurnHandler: () => void,
    private onFalseBurnedHandler: (tile: ITile) => void
  ) {
    this.setupEventListeners();
  }
   removeEventListeners() {
    this._tableController.onBurnAction = null;
    this._tableController.onEndTurnAction = null;
    this._tableController.onFalseBurned = null;
  }
  private setupEventListeners() {
    this._tableController.onBurnAction = this.onBurnHandler;
    this._tableController.onEndTurnAction = this.onEndTurnHandler;
    this._tableController.onFalseBurned = this.onFalseBurnedHandler;
  }  
}

class GameEndHandler {
  constructor(
    private _stateMachine: IStateMachine,
    private _tableController: ITableController,
    private _boosterHandler: BoosterHandler,
    private _uiPanelController: UIPanelController,
    private _gameEventCoordinator: GameEventCoordinator,
  ) {}

  handleGameEnd(results: string, message: string): void {
    this.cleanupGameResources();
  this._gameEventCoordinator.removeEventListeners();


    this._stateMachine.run(StateNames.ResultState, {
      result: results,
      message: message,
      tableController: this._tableController,
    });
  } 
  private cleanupGameResources() {
    this._boosterHandler.dispose();
    this._tableController.removeClickTileListeners();
    this._uiPanelController.removeBoosterListeners();
  }
}

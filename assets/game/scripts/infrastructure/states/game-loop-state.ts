import { TableController } from "../../logic/table/table-controller";
import { ScoreController } from "../../ui/score-controller";
import UiPanelView from "../../ui/ui-panel";
import { IScoreService } from "../services/score-service";
import { IState, IStateMachine } from "../state-machine/state-interfaces";
import { LoseState } from "./lose-state";
import { WinState } from "./win-state";

export class GameLoopState implements IState {
  private _stateMachine: IStateMachine;
  private _scoreService: IScoreService;

  constructor(stateMachine: IStateMachine, scoreService: IScoreService) {
    this._stateMachine = stateMachine;
    this._scoreService = scoreService;
  }
  run(payload: {
    tableController: TableController;
    uiPanelView: UiPanelView;
  }): void {
    const scoreController = new ScoreController(
      this._scoreService,
      payload.uiPanelView
    );

    payload.tableController.onBurn = (groupSize: number) => {
      this._scoreService.nextStep(groupSize);
      scoreController.updateScore();
    };

    this._scoreService.onWin = () => {
      this.handleGameEnd(WinState.name, payload.tableController);
    };
    this._scoreService.onLose = () => {
      this.handleGameEnd(LoseState.name, payload.tableController);
    };
  }
  private handleGameEnd(stateName: string, tableController: TableController) {
    this._scoreService.resetResults();
    this._scoreService.resetSteps();
    tableController.clearTable();
    this._stateMachine.run(stateName);
  }
  stop(): void {}
}
